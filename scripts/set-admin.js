const admin = require('firebase-admin');

// Firebase Admin SDK'yı başlat
const serviceAccount = require('../path/to/your/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const userId = 'gYA9tRQPbigNU54l1laEdJEewB42';

admin.auth().setCustomUserClaims(userId, { admin: true })
  .then(() => {
    console.log('✅ Admin yetkisi başarıyla verildi!');
    console.log(`User ID: ${userId}`);
    console.log('Custom claims: { admin: true }');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Hata:', error);
    process.exit(1);
  });