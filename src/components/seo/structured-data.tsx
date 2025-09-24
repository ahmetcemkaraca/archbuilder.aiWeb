interface StructuredDataProps {
  locale?: string;
}

export function StructuredData({ locale = 'en' }: StructuredDataProps) {
  const baseUrl = (process.env.NEXT_PUBLIC_DOMAIN && process.env.NEXT_PUBLIC_DOMAIN.startsWith('http')) 
    ? process.env.NEXT_PUBLIC_DOMAIN 
    : 'https://archbuilder.ai';

  // Çoklu dil desteği için content mapping
  const getLocalizedContent = (locale: string) => {
    const content: Record<string, any> = {
      en: {
        name: 'ArchBuilder.AI',
        description: 'AI-powered architectural design automation platform that transforms natural language and drawings into Revit projects.',
        pageName: 'ArchBuilder.AI - AI-Powered Architectural Design Automation',
        pageDescription: 'Transform your architectural projects with AI-powered automation. Integrates with Revit, processes DWG/IFC/PDF files, and creates step-by-step project workflows.',
        languages: ['en-US']
      },
      tr: {
        name: 'ArchBuilder.AI',
        description: 'Doğal dil ve çizimleri Revit projelerine dönüştüren AI destekli mimari tasarım otomasyon platformu.',
        pageName: 'ArchBuilder.AI - AI Destekli Mimari Tasarım Otomasyonu',
        pageDescription: 'Mimari projelerinizi AI destekli otomasyon ile dönüştürün. Revit ile entegre olur, DWG/IFC/PDF dosyalarını işler ve adım adım proje iş akışları oluşturur.',
        languages: ['tr-TR']
      },
      ru: {
        name: 'ArchBuilder.AI',
        description: 'Платформа автоматизации архитектурного проектирования на базе ИИ, которая преобразует естественный язык и чертежи в проекты Revit.',
        pageName: 'ArchBuilder.AI - Автоматизация архитектурного проектирования на базе ИИ',
        pageDescription: 'Преобразуйте свои архитектурные проекты с помощью автоматизации на базе ИИ. Интегрируется с Revit, обрабатывает файлы DWG/IFC/PDF и создает пошаговые рабочие процессы проектов.',
        languages: ['ru-RU']
      },
      de: {
        name: 'ArchBuilder.AI',
        description: 'KI-gestützte Plattform für die Automatisierung des Architekturentwurfs, die natürliche Sprache und Zeichnungen in Revit-Projekte umwandelt.',
        pageName: 'ArchBuilder.AI - KI-gestützte Automatisierung des Architekturentwurfs',
        pageDescription: 'Transformieren Sie Ihre Architekturprojekte mit KI-gestützter Automatisierung. Integriert sich in Revit, verarbeitet DWG/IFC/PDF-Dateien und erstellt schrittweise Projekt-Workflows.',
        languages: ['de-DE']
      },
      fr: {
        name: 'ArchBuilder.AI',
        description: 'Plateforme d\'automatisation de conception architecturale alimentée par l\'IA qui transforme le langage naturel et les dessins en projets Revit.',
        pageName: 'ArchBuilder.AI - Automatisation de Conception Architecturale Alimentée par l\'IA',
        pageDescription: 'Transformez vos projets architecturaux avec l\'automatisation alimentée par l\'IA. S\'intègre à Revit, traite les fichiers DWG/IFC/PDF et crée des flux de travail de projet étape par étape.',
        languages: ['fr-FR']
      },
      es: {
        name: 'ArchBuilder.AI',
        description: 'Plataforma de automatización de diseño arquitectónico potenciada por IA que transforma lenguaje natural y dibujos en proyectos Revit.',
        pageName: 'ArchBuilder.AI - Automatización de Diseño Arquitectónico Potenciada por IA',
        pageDescription: 'Transforme sus proyectos arquitectónicos con automatización potenciada por IA. Se integra con Revit, procesa archivos DWG/IFC/PDF y crea flujos de trabajo de proyecto paso a paso.',
        languages: ['es-ES']
      },
      it: {
        name: 'ArchBuilder.AI',
        description: 'Piattaforma di automazione di progettazione architettonica alimentata dall\'IA che trasforma il linguaggio naturale e i disegni in progetti Revit.',
        pageName: 'ArchBuilder.AI - Automazione di Progettazione Architettonica Alimentata dall\'IA',
        pageDescription: 'Trasforma i tuoi progetti architettonici con l\'automazione alimentata dall\'IA. Si integra con Revit, elabora file DWG/IFC/PDF e crea flussi di lavoro di progetto passo dopo passo.',
        languages: ['it-IT']
      }
    };
    return content[locale] || content.en;
  };

  const content = getLocalizedContent(locale);
    
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: content.name,
        alternateName: 'ArchBuilder',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/logo.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://twitter.com/archbuilder_ai',
          'https://linkedin.com/company/archbuilder-ai',
          'https://github.com/archbuilder-ai',
          'https://youtube.com/@archbuilder-ai',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
          contactType: 'customer service',
          email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
          availableLanguage: ['English', 'Turkish', 'Russian', 'German', 'French', 'Spanish', 'Italian'],
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'TR',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: content.name,
        description: content.description,
        publisher: {
          '@id': `${process.env.NEXT_PUBLIC_DOMAIN || 'https://archbuilder.ai'}/#organization`,
        },
        inLanguage: content.languages[0],
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${baseUrl}/#webpage`,
        url: baseUrl,
        name: content.pageName,
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
        about: {
          '@id': `${baseUrl}/#organization`,
        },
        description: content.pageDescription,
        breadcrumb: {
          '@id': `${baseUrl}/#breadcrumb`,
        },
        inLanguage: content.languages[0],
        potentialAction: {
          '@type': 'ReadAction',
          target: [baseUrl],
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${baseUrl}/#software`,
        name: 'ArchBuilder.AI',
        applicationCategory: 'CAD Software',
        applicationSubCategory: 'AI-Powered Architecture',
        operatingSystem: 'Windows, Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          validFrom: '2024-01-01',
          description: '14-day free trial available',
        },
        featureList: [
          'AI-powered architectural design',
          'Revit integration',
          'Multi-format CAD processing (DWG, IFC, PDF)',
          'Step-by-step project workflows',
          'Natural language project creation',
          'Regulatory compliance analysis',
        ],
        screenshot: `${baseUrl}/images/app-screenshot.png`,
        downloadUrl: process.env.NEXT_PUBLIC_DOWNLOAD_URL,
        author: {
          '@id': `${baseUrl}/#organization`,
        },
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${baseUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: baseUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}