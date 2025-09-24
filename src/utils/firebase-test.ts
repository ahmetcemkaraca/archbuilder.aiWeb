/**
 * Firebase Config Test - Bağlantı kontrolü
 */

console.log('🔍 Firebase Configuration Check:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ SET' : '❌ MISSING');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ SET' : '❌ MISSING');
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ SET' : '❌ MISSING');

import { auth, db } from '../lib/firebase-config';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Firebase bağlantı testi başlatılıyor...');
    
    // Auth bağlantısını test et
    console.log('Auth instance:', auth ? '✅' : '❌');
    console.log('Firestore instance:', db ? '✅' : '❌');
    
    // Current user durumunu kontrol et
    console.log('Current user:', auth.currentUser ? auth.currentUser.uid : 'None');
    
    return {
      success: true,
      auth: !!auth,
      firestore: !!db,
      user: auth.currentUser?.uid || null
    };
    
  } catch (error) {
    console.error('❌ Firebase bağlantı hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Otomatik test çalıştır
if (typeof window !== 'undefined') {
  setTimeout(() => {
    testFirebaseConnection();
  }, 1000);
}