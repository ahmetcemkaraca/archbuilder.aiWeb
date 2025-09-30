import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);
export const functions = getFunctions(app, 'europe-west1');

// Connect to emulators in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const isEmulator = window.location.hostname === 'localhost';

    if (isEmulator) {
        try {
            // Auth emulator
            if (!auth.config.emulator) {
                connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
            }

            // Firestore emulator
            if (!db._delegate._databaseId.database.includes('(emulator)')) {
                connectFirestoreEmulator(db, '127.0.0.1', 8080);
            }

            // Storage emulator
            if (!storage._delegate._host.includes('127.0.0.1')) {
                connectStorageEmulator(storage, '127.0.0.1', 9199);
            }

            // Realtime Database emulator
            if (!realtimeDb._delegate._repoInternal.repoInfo_.host.includes('127.0.0.1')) {
                connectDatabaseEmulator(realtimeDb, '127.0.0.1', 9000);
            }

            // Functions emulator
            if (!functions._delegate._url?.includes('127.0.0.1')) {
                connectFunctionsEmulator(functions, '127.0.0.1', 5001);
            }

            console.log('🔧 Firebase emulators connected');
        } catch (error) {
            console.warn('Firebase emulator connection failed:', error);
        }
    }
}

export { app };
export default app;
