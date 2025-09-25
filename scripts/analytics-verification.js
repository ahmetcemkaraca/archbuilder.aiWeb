/**
 * Analytics Verification Script - Browser Console'da çalıştır
 * 
 * Browser Console'a kopyala ve çalıştır:
 * 1. F12 tuşu → Console sekmesi
 * 2. Bu script'i yapıştır ve Enter'a bas
 */

console.log('🔍 Analytics Verification Starting...\n');

// 1. GA4 Script Kontrolü
console.log('📊 GA4 Script Check:');
const ga4Script = document.querySelector('script[src*="gtag/js"]');
console.log('- GA4 Script:', ga4Script ? '✅ LOADED' : '❌ MISSING');

if (ga4Script) {
  console.log('- Script URL:', ga4Script.src);
}

// 2. gtag Function Kontrolü
console.log('- gtag Function:', typeof gtag !== 'undefined' ? '✅ AVAILABLE' : '❌ MISSING');
console.log('- dataLayer:', Array.isArray(window.dataLayer) ? `✅ AVAILABLE (${window.dataLayer.length} items)` : '❌ MISSING');

// 3. Firebase Analytics Kontrolü
console.log('\n🔥 Firebase Analytics Check:');
try {
  // Firebase app kontrolü
  console.log('- Firebase App:', typeof firebase !== 'undefined' ? '✅ AVAILABLE' : '⚠️  NOT LOADED (normal for client-side)');
  
  // Environment variables
  console.log('- Measurement ID:', 'G-Q04NTQS1Q9');
  console.log('- Current URL:', window.location.href);
  console.log('- Page Title:', document.title);
  
} catch (error) {
  console.log('- Firebase Check Error:', error.message);
}

// 4. Test Events Gönder
console.log('\n🚀 Sending Test Events:');

if (typeof gtag !== 'undefined') {
  // Test page view
  gtag('event', 'page_view', {
    page_title: 'Analytics Test',
    page_location: window.location.href,
    custom_parameter: 'verification_test'
  });
  console.log('- ✅ Test page_view sent');
  
  // Test custom event
  gtag('event', 'analytics_test', {
    event_category: 'verification',
    event_label: 'manual_test',
    value: 1,
    debug_mode: true
  });
  console.log('- ✅ Test custom event sent');
  
  // Test conversion
  gtag('event', 'conversion', {
    send_to: 'G-Q04NTQS1Q9',
    conversion_type: 'test_conversion',
    value: 50,
    currency: 'USD'
  });
  console.log('- ✅ Test conversion sent');
  
} else {
  console.log('- ❌ Cannot send test events - gtag not available');
}

// 5. Network Requests Kontrol
console.log('\n🌐 Network Requests Check:');
console.log('- Open Network tab in DevTools');
console.log('- Look for requests to:');
console.log('  * googletagmanager.com/gtag/');
console.log('  * google-analytics.com/');
console.log('  * analytics.google.com/');

// 6. Real-time Kontrol Talimatları
console.log('\n📈 Real-time Analytics Check:');
console.log('1. Go to: https://analytics.google.com/analytics/web/');
console.log('2. Select your property (G-Q04NTQS1Q9)');
console.log('3. Navigate to: Reports → Realtime → Overview');
console.log('4. You should see active users and events');

// 7. Debug Mode Açma
console.log('\n🔧 Debug Mode:');
console.log('Run this in console to enable debug mode:');
console.log('gtag("config", "G-Q04NTQS1Q9", { debug_mode: true });');

// 8. Form Test Talimatları
console.log('\n📝 Form Testing:');
console.log('Test forms to verify conversion tracking:');
console.log('- Contact Form: /contact');
console.log('- Newsletter: Scroll down on homepage');
console.log('- Signup: /signup (with promo code)');
console.log('- Expected conversions: $25, $10, $50 respectively');

console.log('\n✅ Analytics Verification Complete!');
console.log('Check Google Analytics Real-time dashboard for results.');

// 9. DataLayer Contents
console.log('\n📋 DataLayer Contents:');
if (window.dataLayer && window.dataLayer.length > 0) {
  window.dataLayer.forEach((item, index) => {
    console.log(`- Item ${index}:`, item);
  });
} else {
  console.log('- DataLayer is empty or missing');
}