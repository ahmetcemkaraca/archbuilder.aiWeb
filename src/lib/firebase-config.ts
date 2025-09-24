/**
 * Firebase Yapılandırması - ArchBuilder.AI
 * Firestore ve Analytics entegrasyonu
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase uygulama örneği
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

// Firebase'i başlat (çoklu instance'dan kaçın)
try {
  if (!getApps().length) {
    console.log('🔥 Firebase başlatılıyor...');
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase başarıyla başlatıldı');
  } else {
    app = getApps()[0];
    console.log('♻️  Mevcut Firebase instance kullanılıyor');
  }

  // Firestore ve Auth'u başlat
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Bağlantı ayarları
  auth.settings.appVerificationDisabledForTesting = false;
  
} catch (error) {
  console.error('❌ Firebase başlatma hatası:', error);
  throw new Error(`Firebase başlatılamadı: ${error}`);
}

// Firebase bağlantısının geçerli olup olmadığını kontrol et
export const checkFirebaseConnection = (): boolean => {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  return requiredEnvVars.every(varName => 
    process.env[varName] && process.env[varName] !== ''
  );
};

export { app, db, auth };
export default app;