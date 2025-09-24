/**
 * Analytics Test Script - GA4 ve Firebase Analytics test
 * Test etmek için: npm run test:analytics
 */

console.log('🔍 Analytics Test Başlatılıyor...\n');

// Environment kontrolü
console.log('📊 Environment Değişkenleri:');
console.log('- MEASUREMENT_ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '❌ MISSING');
console.log('- PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ MISSING');
console.log('- API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ SET' : '❌ MISSING');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('');

// Test events gönder
const testAnalytics = async () => {
  try {
    console.log('🔥 Firebase Analytics Test...');
    
    // Firebase Analytics import
    const { initializeFirebase, trackEvent } = await import('../src/lib/firebase-analytics.js');
    
    // Initialize Firebase
    const initialized = initializeFirebase();
    console.log('- Initialization:', initialized ? '✅ SUCCESS' : '❌ FAILED');
    
    if (initialized) {
      // Test events
      console.log('- Sending test events...');
      
      trackEvent.pageView('/test', 'Analytics Test Page');
      console.log('  ✅ Page view sent');
      
      trackEvent.contactFormSubmit('test', true);
      console.log('  ✅ Form submit sent');
      
      trackEvent.promoCodeUsage('TEST_CODE', false);
      console.log('  ✅ Promo code sent');
      
      trackEvent.engagement('test_click', 'analytics_test');
      console.log('  ✅ Engagement sent');
      
      // Usage stats
      const { costOptimization } = await import('../src/lib/firebase-analytics.js');
      const stats = costOptimization.getUsageStats();
      console.log('- Usage Stats:', stats);
      
    }
    
  } catch (error) {
    console.error('❌ Firebase Analytics Test Failed:', error.message);
  }
  
  // GA4 Test
  console.log('\n📊 GA4 Test...');
  try {
    // Simüle gtag function
    global.gtag = (...args) => {
      console.log('  📈 GA4 Event:', args);
    };
    
    global.dataLayer = [];
    
    // Test GA4 events
    gtag('event', 'test_event', {
      event_category: 'analytics_test',
      event_label: 'node_test',
      value: 1
    });
    
    console.log('  ✅ GA4 events sent');
    
  } catch (error) {
    console.error('  ❌ GA4 Test Failed:', error.message);
  }
  
  console.log('\n🎯 Test Tamamlandı!');
  console.log('Real-time Analytics için:');
  console.log('- GA4: https://analytics.google.com/analytics/web/#/realtime/overview');
  console.log('- Firebase: https://console.firebase.google.com/project/archbuilderai/analytics');
};

// Node.js ortamını simüle et
if (typeof window === 'undefined') {
  global.window = {
    location: { href: 'http://localhost:3000/test', pathname: '/test' },
    document: { title: 'Analytics Test' },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    navigator: { language: 'en-US' }
  };
  global.document = { title: 'Analytics Test' };
}

testAnalytics();