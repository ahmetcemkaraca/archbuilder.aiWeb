import Link from 'next/link';

/**
 * Custom 404 Page for ArchBuilder.AI
 * Static export uyumlu özelleştirilmiş 404 sayfası
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <h1 className="text-[150px] sm:text-[200px] lg:text-[250px] font-bold text-gray-200 dark:text-gray-700 leading-none select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.923.785-5.291 2.067M6.343 6.343A8 8 0 1117.657 17.657 8 8 0 016.343 6.343z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Sayfa Bulunamadı
            </h2>
            
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Aradığınız sayfa mevcut değil veya başka bir adrese taşınmış olabilir. 
              AI destekli mimarlık projelerinize geri dönelim.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/"
                className="px-6 sm:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Ana Sayfaya Dön
              </Link>
              
              <Link
                href="/contact"
                className="px-6 sm:px-8 py-3 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
              >
                Destek Al
              </Link>
            </div>

            {/* Quick Links */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Belirli bir şey mi arıyorsunuz?
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/#features" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Özellikler
                </Link>
                <Link href="/#pricing" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Fiyatlandırma
                </Link>
                <Link href="/#technology" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Teknoloji
                </Link>
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Gizlilik Politikası
                </Link>
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Kullanım Şartları
                </Link>
              </div>
            </div>

            {/* Search Suggestion */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Hala aradığınızı bulamadınız mı?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Dokümantasyonumuzu inceleyin veya destek ekibimizle iletişime geçin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/about"
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Hakkımızda
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-center transition-colors"
                >
                  Yardım Al
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}