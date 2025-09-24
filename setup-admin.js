/**
 * Firebase Admin SDK ile admin token ekleme scripti
 * Bu dosyayı bir kez çalıştırıp silin
 */

const admin = require('firebase-admin');

// Firebase Admin SDK yapılandırması gerekli
// Service account key JSON dosyası gerekli

// Örnek kullanım:
const uid = 'BURAYA_USER_UID_YAPISTIR'; // Firebase Console'dan alacaksınız

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('✅ Admin token başarıyla eklendi!');
    console.log(`User ${uid} artık admin yetkilerine sahip.`);
  })
  .catch((error) => {
    console.error('❌ Hata:', error);
  });