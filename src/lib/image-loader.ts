/**
 * Custom Image Loader for Static Export
 * 
 * Bu loader static export sırasında image optimizasyonu sağlar
 * ve CDN deployment için uygun URL yapıları oluşturur.
 */

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  // Geliştirme ortamında basit passthrough
  if (process.env.NODE_ENV === 'development') {
    return src;
  }
  
  // CDN base URL (production ortamında)
  const cdnBase = process.env.NEXT_PUBLIC_CDN_URL || process.env.NEXT_PUBLIC_DOMAIN || '';
  
  // External URL'ler için direkt return
  if (src.startsWith('http')) {
    return src;
  }
  
  // SVG dosyaları için özel işlem
  if (src.endsWith('.svg')) {
    return `${cdnBase}${src}`;
  }
  
  // Quality parametresi (varsayılan 75)
  const q = quality || 75;
  
  // Static export için optimized path
  if (cdnBase) {
    // CDN kullanıyorsak, CDN-friendly URL oluştur
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      q: q.toString(),
    });
    
    return `${cdnBase}/api/images?${params.toString()}`;
  }
  
  // Fallback: orijinal src
  return src;
}

/**
 * Image URL helper function
 * Component'lerde kullanım için helper
 */
export function getOptimizedImageUrl(
  src: string,
  width: number = 1200,
  quality: number = 75
): string {
  return imageLoader({ src, width, quality });
}

/**
 * Responsive image srcSet generator
 * Çoklu resolution desteği için
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [640, 828, 1200, 1920],
  quality: number = 75
): string {
  return widths
    .map(width => `${imageLoader({ src, width, quality })} ${width}w`)
    .join(', ');
}

/**
 * Image preload helper
 * Critical images için preload link oluşturur
 */
export function getImagePreloadLink(
  src: string,
  width: number = 1200,
  quality: number = 75
): { rel: string; href: string; as: string; type: string } {
  const href = imageLoader({ src, width, quality });
  const type = src.endsWith('.webp') ? 'image/webp' : 
               src.endsWith('.avif') ? 'image/avif' : 'image/jpeg';
  
  return {
    rel: 'preload',
    href,
    as: 'image',
    type
  };
}