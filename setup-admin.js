/**
 * Firebase Admin SDK ile admin token ekleme scripti
 * Bu dosyayı tek seferlik CLI scripti olarak kullanın.
 * Not: ESM import kullanılır; Node 18+ önerilir.
 */

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';
import path from 'node:path';

// Service account dosyası yolu (örn: ./.secrets/serviceAccount.json)
// Güvenlik: Bu dosyayı VCS'e eklemeyin. Ortam değişkeni ile de verebilirsiniz.
const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '';

// Uygulama başlatma
function initFirebaseAdmin() {
  // Önceçe varsayılan kimlik bilgisi ile dene; yoksa service account dosyası
  try {
    if (SERVICE_ACCOUNT_PATH && fs.existsSync(path.resolve(SERVICE_ACCOUNT_PATH))) {
      const sa = JSON.parse(fs.readFileSync(path.resolve(SERVICE_ACCOUNT_PATH), 'utf8'));
      initializeApp({ credential: cert(sa) });
    } else {
      initializeApp({ credential: applicationDefault() });
    }
  } catch (e) {
    // Türkçe log: Admin başlatma hatası
    console.error('⚠️ Firebase Admin başlatma hatası:', e);
    process.exit(1);
  }
}

async function setAdmin(uid) {
  // Hata kontrolü
  if (!uid) {
    console.error('Kullanım: node setup-admin.js <uid>');
    process.exit(1);
  }

  initFirebaseAdmin();
  const auth = getAuth();
  try {
    await auth.setCustomUserClaims(uid, { admin: true });
    console.log('✅ Admin token başarıyla eklendi!');
    console.log(`User ${uid} artık admin yetkilerine sahip.`);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exitCode = 1;
  }
}

// CLI girişi: node setup-admin.js <uid>
const uidFromArg = process.argv[2];
setAdmin(uidFromArg);