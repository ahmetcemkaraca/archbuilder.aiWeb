/**
 * Firebase Admin Claims Ayarlama Scripti (ESM)
 * Usage: node scripts/set-admin-claims.js <USER_ID>
 */

import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';
import path from 'node:path';

// Kullanıcı ID'si CLI'dan alınır
const userId = process.argv[2];

if (!userId) {
  console.error('❌ Kullanım: node scripts/set-admin-claims.js <USER_ID>');
  process.exit(1);
}

// Firebase Admin'ı başlat
function initAdmin() {
  if (getApps().length) return;

  // Tercih sırası: GOOGLE_APPLICATION_CREDENTIALS -> serviceAccount.json -> applicationDefault()

  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credsPath && fs.existsSync(credsPath)) {
    initializeApp({ credential: cert(JSON.parse(fs.readFileSync(credsPath, 'utf-8'))) });
    console.log('✅ Admin initialized with GOOGLE_APPLICATION_CREDENTIALS');
    return;
  }

  const localSa = path.resolve(process.cwd(), 'service-account.json');
  if (fs.existsSync(localSa)) {
    initializeApp({ credential: cert(JSON.parse(fs.readFileSync(localSa, 'utf-8'))) });
    console.log('✅ Admin initialized with local service-account.json');
    return;
  }

  initializeApp({ credential: applicationDefault() });
  console.log('✅ Admin initialized with applicationDefault');
}

async function setAdminClaims(uid) {
  try {
    initAdmin();
    console.log(`🔐 User ID: ${uid} için admin yetkisi veriliyor...`);
    await getAuth().setCustomUserClaims(uid, {
      admin: true,
      role: 'admin',
      timestamp: Date.now(),
    });
    console.log('✅ Admin yetkisi başarıyla verildi!');
    const userRecord = await getAuth().getUser(uid);
    console.log('👤 Kullanıcı:', userRecord.email || 'No email');
    console.log('🏷️  Custom Claims:', userRecord.customClaims);
  } catch (error) {
    console.error('❌ Admin yetkisi verilemedi:', error?.message || error);
    if (error?.code === 'auth/user-not-found') {
      console.log('💡 Bu User ID Firebase Authentication\'da bulunamadı');
    }
    process.exit(1);
  }
}

setAdminClaims(userId).then(() => {
  console.log('🎯 İşlem tamamlandı');
  process.exit(0);
});
