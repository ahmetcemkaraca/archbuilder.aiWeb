/**
 * Firebase Debug - Network hatasını çözme scripti
 */

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "demo-project.firebaseapp.com", 
  projectId: "demo-archbuilderai",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

// Test için yerel emulator kullan
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Development ortamında emulator'a bağlan
if (typeof window !== 'undefined') {
  console.log('🔥 Firebase Emulator baglaniyor...');
  
  try {
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('✅ Emulator baglantisi basarili');
  } catch (error) {
    console.log('⚠️ Emulator bulunamadi, production kullaniliyor');
  }
}

export { auth, db };