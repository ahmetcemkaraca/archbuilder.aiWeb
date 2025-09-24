/**
 * Firebase Admin Claims Ayarlama Scripti
 * Usage: node set-admin-claims.js gYA9tRQPbigNU54l1laEdJEewB42
 */

const admin = require('firebase-admin');

// Service Account Key gerekli değil, Firebase CLI auth kullanacağız
// Firebase CLI ile zaten authenticate edilmişsiniz

const userId = process.argv[2];

if (!userId) {
  console.error('❌ Kullanım: node set-admin-claims.js <USER_ID>');
  process.exit(1);
}

// Firebase Admin SDK'yı minimal config ile başlat
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      projectId: 'archbuilderai'
    });
    console.log('✅ Firebase Admin SDK başlatıldı');
  } catch (error) {
    console.error('❌ Firebase Admin SDK başlatma hatası:', error.message);
    process.exit(1);
  }
}

// Admin claims ayarla
async function setAdminClaims() {
  try {
    console.log(`🔐 User ID: ${userId} için admin yetkisi veriliyor...`);
    
    await admin.auth().setCustomUserClaims(userId, { 
      admin: true,
      role: 'admin',
      timestamp: Date.now()
    });
    
    console.log('✅ Admin yetkisi başarıyla verildi!');
    console.log('🔄 Kullanıcının yeniden giriş yapması gerekiyor');
    
    // Kullanıcı bilgilerini kontrol et
    const userRecord = await admin.auth().getUser(userId);
    console.log('👤 Kullanıcı:', userRecord.email || 'No email');
    console.log('🏷️  Custom Claims:', userRecord.customClaims);
    
  } catch (error) {
    console.error('❌ Admin yetkisi verilemedi:', error.message);
    
    if (error.code === 'auth/user-not-found') {
      console.log('💡 Bu User ID Firebase Authentication\'da bulunamadı');
      console.log('   Firebase Console\'da kullanıcı oluşturulmuş olduğundan emin olun');
    }
  }
}

setAdminClaims().then(() => {
  console.log('🎯 İşlem tamamlandı');
  process.exit(0);
});