import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'node:fs';
import path from 'node:path';

const userId = process.argv[2];
if (!userId) {
  console.error('❌ Kullanım: node scripts/set-admin.js <USER_ID>');
  process.exit(1);
}

function initAdmin() {
  if (getApps().length) return;

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

async function run(uid) {
  try {
    initAdmin();
    await getAuth().setCustomUserClaims(uid, { admin: true });
    console.log('✅ Admin yetkisi başarıyla verildi!');
    console.log(`User ID: ${uid}`);
    console.log('Custom claims: { admin: true }');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error?.message || error);
    process.exit(1);
  }
}

run(userId);