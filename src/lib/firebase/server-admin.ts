import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | null = null;

export const getAdminApp = () => {
    if (adminApp) {
        return adminApp;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const databaseURL = process.env.FIREBASE_DATABASE_URL;

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Firebase Admin environment variables are not set.');
    }

    const apps = getApps();
    if (apps.length) {
        adminApp = apps[0];
        return adminApp;
    }

    adminApp = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL,
    });

    return adminApp;
};

export const adminAuth = () => getAuth(getAdminApp());
