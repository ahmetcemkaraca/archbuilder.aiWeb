'use client';

import { auth, db } from '@/lib/firebase';
import {
    AuthError,
    EmailAuthProvider,
    GoogleAuthProvider,
    User,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// Types
export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
    subscription: {
        plan: 'free' | 'pro' | 'enterprise';
        expiresAt: Date | null;
        features: string[];
    };
    preferences: {
        language: string;
        theme: string;
        notifications: boolean;
    };
    createdAt: Date;
    lastLoginAt: Date;
    emailVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
    updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
    resendEmailVerification: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const syncAuthCookies = async (firebaseUser: User) => {
        try {
            const idToken = await firebaseUser.getIdToken(true);
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
        } catch (error) {
            console.error('Failed to synchronize auth cookies:', error);
        }
    };

    // Create or update user profile in Firestore
    const createUserProfile = async (user: User, additionalData?: any) => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            const { displayName, email, photoURL } = user;
            const profileData: UserProfile = {
                uid: user.uid,
                email: email!,
                displayName: displayName || '',
                photoURL: photoURL || undefined,
                subscription: {
                    plan: 'free',
                    expiresAt: null,
                    features: ['basic_ai', 'file_upload'],
                },
                preferences: {
                    language: 'tr',
                    theme: 'light',
                    notifications: true,
                },
                createdAt: new Date(),
                lastLoginAt: new Date(),
                emailVerified: user.emailVerified,
                ...additionalData,
            };

            try {
                await setDoc(userRef, {
                    ...profileData,
                    createdAt: serverTimestamp(),
                    lastLoginAt: serverTimestamp(),
                });
                setProfile(profileData);
            } catch (error) {
                console.error('Error creating user profile:', error);
                throw error;
            }
        } else {
            // Update last login time
            await updateDoc(userRef, {
                lastLoginAt: serverTimestamp(),
                emailVerified: user.emailVerified,
            });

            // Get existing profile
            const existingProfile = userDoc.data() as UserProfile;
            setProfile({
                ...existingProfile,
                lastLoginAt: new Date(),
                emailVerified: user.emailVerified,
            });
        }
    };

    // Load user profile from Firestore
    const loadUserProfile = async (user: User) => {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const profileData = userDoc.data() as UserProfile;
                setProfile({
                    ...profileData,
                    createdAt: profileData.createdAt instanceof Date ? profileData.createdAt : new Date(profileData.createdAt),
                    lastLoginAt: profileData.lastLoginAt instanceof Date ? profileData.lastLoginAt : new Date(profileData.lastLoginAt),
                });
            } else {
                await createUserProfile(user);
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const result = await signInWithEmailAndPassword(auth, email, password);
            await createUserProfile(result.user);
            await syncAuthCookies(result.user);
            toast.success('Başarıyla giriş yapıldı!');
        } catch (error) {
            const authError = error as AuthError;
            toast.error(getAuthErrorMessage(authError.code));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign up with email and password
    const signUp = async (email: string, password: string, displayName: string) => {
        try {
            setLoading(true);
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(result.user, { displayName });

            // Send email verification
            await sendEmailVerification(result.user);

            // Create profile
            await createUserProfile(result.user, { displayName });
            await syncAuthCookies(result.user);

            toast.success('Hesap oluşturuldu! Lütfen email adresinizi doğrulayın.');
        } catch (error) {
            const authError = error as AuthError;
            toast.error(getAuthErrorMessage(authError.code));
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign in with Google
    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.addScope('profile');

            const result = await signInWithPopup(auth, provider);
            await createUserProfile(result.user);
            await syncAuthCookies(result.user);
            toast.success('Google ile giriş başarılı!');
        } catch (error) {
            const authError = error as AuthError;
            if (authError.code !== 'auth/popup-closed-by-user') {
                toast.error(getAuthErrorMessage(authError.code));
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            setProfile(null);
            toast.success('Çıkış yapıldı');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Çıkış yaparken hata oluştu');
        }
    };

    // Reset password
    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Şifre sıfırlama emaili gönderildi');
        } catch (error) {
            const authError = error as AuthError;
            toast.error(getAuthErrorMessage(authError.code));
            throw error;
        }
    };

    // Update user profile
    const updateUserProfile = async (updates: Partial<UserProfile>) => {
        if (!user || !profile) throw new Error('User not authenticated');

        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, updates);

            setProfile({ ...profile, ...updates });
            toast.success('Profil güncellendi');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Profil güncellenirken hata oluştu');
            throw error;
        }
    };

    // Update password
    const updateUserPassword = async (currentPassword: string, newPassword: string) => {
        if (!user) throw new Error('User not authenticated');

        try {
            const credential = EmailAuthProvider.credential(user.email!, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPassword);
            toast.success('Şifre güncellendi');
        } catch (error) {
            const authError = error as AuthError;
            toast.error(getAuthErrorMessage(authError.code));
            throw error;
        }
    };

    // Resend email verification
    const resendEmailVerification = async () => {
        if (!user) throw new Error('User not authenticated');

        try {
            await sendEmailVerification(user);
            toast.success('Doğrulama emaili tekrar gönderildi');
        } catch (error) {
            const authError = error as AuthError;
            toast.error(getAuthErrorMessage(authError.code));
            throw error;
        }
    };

    // Refresh profile
    const refreshProfile = async () => {
        if (!user) return;
        await loadUserProfile(user);
    };

    // Auth state change listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user) {
                setUser(user);
                await loadUserProfile(user);
            } else {
                setUser(null);
                setProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
        updateUserPassword,
        resendEmailVerification,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper function to get readable error messages
const getAuthErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
        'auth/user-disabled': 'Bu hesap devre dışı bırakılmış.',
        'auth/user-not-found': 'Kullanıcı bulunamadı.',
        'auth/wrong-password': 'Geçersiz şifre.',
        'auth/email-already-in-use': 'Bu email adresi zaten kullanımda.',
        'auth/weak-password': 'Şifre çok zayıf.',
        'auth/network-request-failed': 'Ağ bağlantısı hatası.',
        'auth/too-many-requests': 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.',
        'auth/requires-recent-login': 'Bu işlem için tekrar giriş yapmanız gerekiyor.',
        'auth/invalid-email': 'Geçersiz email adresi.',
        'auth/operation-not-allowed': 'Bu işlem izin verilmiyor.',
        'auth/popup-blocked': 'Popup penceresi engellenmiş.',
        'auth/cancelled-popup-request': 'Popup isteği iptal edildi.',
        'auth/popup-closed-by-user': 'Popup penceresi kullanıcı tarafından kapatıldı.',
    };

    return errorMessages[errorCode] || 'Bilinmeyen hata oluştu.';
};
