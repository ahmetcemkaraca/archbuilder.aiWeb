'use client';

import { db, realtimeDb } from '@/lib/firebase';
import { off, onChildAdded, push, ref, serverTimestamp } from 'firebase/database';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

// Types
export interface WebRTCSession {
    id: string;
    userId: string;
    projectId: string;
    status: 'pending' | 'active' | 'ended';
    participants: {
        web: boolean;
        plugin: boolean;
    };
    iceServers: RTCIceServer[];
    createdAt: Date;
    expiresAt: Date;
}

export interface SignalingMessage {
    type: 'offer' | 'answer' | 'ice-candidate' | 'error' | 'status';
    data: any;
    sender: 'web' | 'plugin';
    timestamp: number;
}

export interface AICommand {
    id: string;
    sessionId: string;
    projectId: string;
    type: 'generate' | 'modify' | 'analyze' | 'export';
    payload: Record<string, any>;
    status: 'pending' | 'executing' | 'completed' | 'error';
    result?: any;
    error?: string;
    progress?: number;
    createdAt: Date;
    completedAt?: Date;
}

interface WebRTCContextType {
    // Connection state
    session: WebRTCSession | null;
    connectionState: RTCPeerConnectionState;
    dataChannelState: RTCDataChannelState;
    isConnected: boolean;
    isConnecting: boolean;

    // Session management
    createSession: (projectId: string) => Promise<string>;
    joinSession: (sessionId: string) => Promise<void>;
    endSession: () => Promise<void>;

    // WebRTC connection
    createConnection: () => Promise<void>;
    closeConnection: () => void;

    // Command handling
    sendCommand: (command: Omit<AICommand, 'id' | 'sessionId' | 'createdAt' | 'status'>) => Promise<void>;
    onCommandReceived: (callback: (command: AICommand) => void) => () => void;

    // Real-time messaging
    sendMessage: (type: string, data: any) => Promise<void>;
    onMessageReceived: (callback: (message: SignalingMessage) => void) => () => void;

    // Status
    connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
    lastError: string | null;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const useWebRTC = () => {
    const context = useContext(WebRTCContext);
    if (context === undefined) {
        throw new Error('useWebRTC must be used within a WebRTCProvider');
    }
    return context;
};

interface WebRTCProviderProps {
    children: React.ReactNode;
}

export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
    const { user } = useAuth();

    // State
    const [session, setSession] = useState<WebRTCSession | null>(null);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
    const [dataChannelState, setDataChannelState] = useState<RTCDataChannelState>('connecting');
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
    const [lastError, setLastError] = useState<string | null>(null);

    // Refs
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const dataChannel = useRef<RTCDataChannel | null>(null);
    const signalingRef = useRef<any>(null);
    const commandCallbacks = useRef<Set<(command: AICommand) => void>>(new Set());
    const messageCallbacks = useRef<Set<(message: SignalingMessage) => void>>(new Set());

    // ICE Servers configuration
    const iceServers: RTCIceServer[] = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // TURN servers will be added from environment variables
        ...(process.env.NEXT_PUBLIC_TURN_SERVER_URL ? [{
            urls: process.env.NEXT_PUBLIC_TURN_SERVER_URL,
            username: process.env.NEXT_PUBLIC_TURN_SERVER_USERNAME,
            credential: process.env.NEXT_PUBLIC_TURN_SERVER_CREDENTIAL,
        }] : []),
    ];

    const isConnected = connectionState === 'connected' && dataChannelState === 'open';

    // Create WebRTC session
    const createSession = async (projectId: string): Promise<string> => {
        if (!user) throw new Error('User not authenticated');

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sessionData: WebRTCSession = {
            id: sessionId,
            userId: user.uid,
            projectId,
            status: 'pending',
            participants: {
                web: true,
                plugin: false,
            },
            iceServers,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        };

        try {
            await setDoc(doc(db, 'sessions', sessionId), {
                ...sessionData,
                createdAt: serverTimestamp(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });

            setSession(sessionData);
            setupSignaling(sessionId);

            return sessionId;
        } catch (error) {
            setLastError('Failed to create session');
            throw error;
        }
    };

    // Join existing session
    const joinSession = async (sessionId: string): Promise<void> => {
        if (!user) throw new Error('User not authenticated');

        try {
            const sessionDoc = doc(db, 'sessions', sessionId);
            await updateDoc(sessionDoc, {
                [`participants.${user.uid}`]: true,
            });

            setupSignaling(sessionId);
        } catch (error) {
            setLastError('Failed to join session');
            throw error;
        }
    };

    // End session
    const endSession = async (): Promise<void> => {
        if (!session) return;

        try {
            await updateDoc(doc(db, 'sessions', session.id), {
                status: 'ended',
            });

            closeConnection();
            cleanupSignaling();
            setSession(null);
        } catch (error) {
            console.error('Error ending session:', error);
        }
    };

    // Setup WebRTC signaling
    const setupSignaling = (sessionId: string) => {
        signalingRef.current = ref(realtimeDb, `signaling/${sessionId}`);

        // Listen for signaling messages
        const offersRef = ref(realtimeDb, `signaling/${sessionId}/offers`);
        const answersRef = ref(realtimeDb, `signaling/${sessionId}/answers`);
        const iceCandidatesRef = ref(realtimeDb, `signaling/${sessionId}/iceCandidates`);

        onChildAdded(offersRef, handleSignalingMessage);
        onChildAdded(answersRef, handleSignalingMessage);
        onChildAdded(iceCandidatesRef, handleSignalingMessage);
    };

    // Handle signaling messages
    const handleSignalingMessage = async (snapshot: any) => {
        const message: SignalingMessage = snapshot.val();
        if (!message || message.sender === 'web') return; // Ignore own messages

        try {
            if (message.type === 'offer') {
                await handleOffer(message.data);
            } else if (message.type === 'answer') {
                await handleAnswer(message.data);
            } else if (message.type === 'ice-candidate') {
                await handleIceCandidate(message.data);
            }
        } catch (error) {
            console.error('Error handling signaling message:', error);
            setLastError('Signaling error occurred');
        }
    };

    // Create WebRTC connection
    const createConnection = async (): Promise<void> => {
        if (!session) throw new Error('No active session');

        setIsConnecting(true);
        setLastError(null);

        try {
            // Create peer connection
            peerConnection.current = new RTCPeerConnection({
                iceServers,
                iceTransportPolicy: 'all',
                bundlePolicy: 'max-bundle',
                rtcpMuxPolicy: 'require',
            });

            // Setup connection state monitoring
            peerConnection.current.onconnectionstatechange = () => {
                const state = peerConnection.current?.connectionState || 'new';
                setConnectionState(state);

                if (state === 'connected') {
                    setIsConnecting(false);
                    monitorConnectionQuality();
                } else if (state === 'failed' || state === 'disconnected') {
                    setIsConnecting(false);
                    setConnectionQuality('disconnected');
                }
            };

            // Setup ICE candidate handling
            peerConnection.current.onicecandidate = (event) => {
                if (event.candidate) {
                    sendSignalingMessage('ice-candidate', event.candidate);
                }
            };

            // Create data channel
            dataChannel.current = peerConnection.current.createDataChannel('commands', {
                ordered: true,
            });

            dataChannel.current.onopen = () => {
                setDataChannelState('open');
                toast.success('Revit plugin connected successfully!');
            };

            dataChannel.current.onclose = () => {
                setDataChannelState('closed');
            };

            dataChannel.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleDataChannelMessage(data);
                } catch (error) {
                    console.error('Error parsing data channel message:', error);
                }
            };

            // Handle incoming data channels
            peerConnection.current.ondatachannel = (event) => {
                const channel = event.channel;
                channel.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        handleDataChannelMessage(data);
                    } catch (error) {
                        console.error('Error parsing incoming data channel message:', error);
                    }
                };
            };

            // Create offer
            const offer = await peerConnection.current.createOffer({
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
            });

            await peerConnection.current.setLocalDescription(offer);
            await sendSignalingMessage('offer', offer);

        } catch (error) {
            setIsConnecting(false);
            setLastError('Failed to create WebRTC connection');
            throw error;
        }
    };

    // Handle WebRTC offer
    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
        if (!peerConnection.current) return;

        await peerConnection.current.setRemoteDescription(offer);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        await sendSignalingMessage('answer', answer);
    };

    // Handle WebRTC answer
    const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
        if (!peerConnection.current) return;
        await peerConnection.current.setRemoteDescription(answer);
    };

    // Handle ICE candidate
    const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
        if (!peerConnection.current) return;
        await peerConnection.current.addIceCandidate(candidate);
    };

    // Send signaling message
    const sendSignalingMessage = async (type: string, data: any) => {
        if (!session || !signalingRef.current) return;

        const message: SignalingMessage = {
            type: type as any,
            data,
            sender: 'web',
            timestamp: Date.now(),
        };

        await push(ref(realtimeDb, `signaling/${session.id}/${type}s`), message);
    };

    // Handle data channel messages
    const handleDataChannelMessage = (data: any) => {
        if (data.type === 'command-response') {
            // Handle command responses
            commandCallbacks.current.forEach(callback => callback(data.command));
        } else {
            // Handle other messages
            messageCallbacks.current.forEach(callback => callback(data));
        }
    };

    // Send command via data channel
    const sendCommand = async (command: Omit<AICommand, 'id' | 'sessionId' | 'createdAt' | 'status'>): Promise<void> => {
        if (!isConnected || !dataChannel.current || !session) {
            throw new Error('Not connected to Revit plugin');
        }

        const fullCommand: AICommand = {
            ...command,
            id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sessionId: session.id,
            status: 'pending',
            createdAt: new Date(),
        };

        const message = {
            type: 'ai-command',
            command: fullCommand,
        };

        dataChannel.current.send(JSON.stringify(message));
    };

    // Send message via data channel
    const sendMessage = async (type: string, data: any): Promise<void> => {
        if (!isConnected || !dataChannel.current) {
            throw new Error('Not connected to Revit plugin');
        }

        const message = { type, data, timestamp: Date.now() };
        dataChannel.current.send(JSON.stringify(message));
    };

    // Subscribe to command responses
    const onCommandReceived = (callback: (command: AICommand) => void): (() => void) => {
        commandCallbacks.current.add(callback);
        return () => commandCallbacks.current.delete(callback);
    };

    // Subscribe to messages
    const onMessageReceived = (callback: (message: SignalingMessage) => void): (() => void) => {
        messageCallbacks.current.add(callback);
        return () => messageCallbacks.current.delete(callback);
    };

    // Monitor connection quality
    const monitorConnectionQuality = useCallback(async () => {
        if (!peerConnection.current) return;

        try {
            const stats = await peerConnection.current.getStats();
            let quality: 'excellent' | 'good' | 'poor' | 'disconnected' = 'excellent';

            stats.forEach((stat) => {
                if (stat.type === 'candidate-pair' && stat.state === 'succeeded') {
                    const rtt = stat.currentRoundTripTime || 0;
                    if (rtt > 0.5) quality = 'poor';
                    else if (rtt > 0.2) quality = 'good';
                }
            });

            setConnectionQuality(quality);
        } catch (error) {
            setConnectionQuality('poor');
        }
    }, []);

    // Close WebRTC connection
    const closeConnection = () => {
        if (dataChannel.current) {
            dataChannel.current.close();
            dataChannel.current = null;
        }

        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = null;
        }

        setConnectionState('closed');
        setDataChannelState('closed');
        setConnectionQuality('disconnected');
    };

    // Cleanup signaling
    const cleanupSignaling = () => {
        if (signalingRef.current) {
            off(signalingRef.current);
            signalingRef.current = null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            closeConnection();
            cleanupSignaling();
        };
    }, []);

    // Monitor connection quality periodically
    useEffect(() => {
        if (!isConnected) return;

        const interval = setInterval(monitorConnectionQuality, 5000);
        return () => clearInterval(interval);
    }, [isConnected, monitorConnectionQuality]);

    const value = {
        session,
        connectionState,
        dataChannelState,
        isConnected,
        isConnecting,
        createSession,
        joinSession,
        endSession,
        createConnection,
        closeConnection,
        sendCommand,
        onCommandReceived,
        sendMessage,
        onMessageReceived,
        connectionQuality,
        lastError,
    };

    return <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>;
};
