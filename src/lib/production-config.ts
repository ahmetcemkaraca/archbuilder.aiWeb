/**
 * Production Environment Configuration
 * Hosting, domain, SSL ve CDN setup specifications
 */

export interface ProductionConfig {
  hosting: {
    primary: HostingProvider;
    cdn: CDNProvider;
    dns: DNSProvider;
    ssl: SSLProvider;
  };
  domains: {
    primary: string;
    www: string;
    redirects: string[];
  };
  performance: {
    caching: CacheConfig;
    compression: CompressionConfig;
    optimization: OptimizationConfig;
  };
  security: SecurityConfig;
  monitoring: MonitoringConfig;
}

export interface HostingProvider {
  name: 'netlify' | 'vercel' | 'cloudflare-pages' | 'aws-s3' | 'github-pages' | 'firebase';
  config: {
    buildCommand: string;
    publishDirectory: string;
    nodeVersion: string;
    environmentVariables: Record<string, string>;
    redirects: RedirectRule[];
    headers: HeaderRule[];
  };
}

export interface CDNProvider {
  name: 'cloudflare' | 'aws-cloudfront' | 'netlify-cdn' | 'vercel-edge' | 'firebase-cdn';
  config: {
    zones: string[];
    cacheRules: CacheRule[];
    purgeStrategy: 'auto' | 'manual' | 'webhook';
    edgeLocations: string[];
  };
}

export interface DNSProvider {
  name: 'cloudflare' | 'aws-route53' | 'netlify' | 'vercel' | 'namecheap' | 'firebase';
  config?: {
    zone?: string;
    records?: DNSRecord[];
  };
}

export interface SSLProvider {
  name: 'letsencrypt' | 'cloudflare' | 'aws-acm' | 'custom' | 'firebase';
  config?: {
    domains?: string[];
    autoRenewal?: boolean;
  };
}

export interface DNSRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT';
  name: string;
  value: string;
  ttl?: number;
}

export interface RedirectRule {
  from: string;
  to: string;
  status: 200 | 301 | 302 | 308;
  force?: boolean;
  conditions?: {
    country?: string[];
    language?: string[];
  };
}

export interface HeaderRule {
  for: string;
  values: Record<string, string>;
}

export interface CacheRule {
  path: string;
  ttl: number; // seconds
  edgeTtl?: number;
  browserTtl?: number;
}

export interface CacheConfig {
  staticAssets: {
    css: number; // 1 year
    js: number; // 1 year
    images: number; // 6 months
    fonts: number; // 1 year
  };
  pages: {
    html: number; // 1 hour
    api: number; // 5 minutes
    sitemap: number; // 1 day
  };
  headers: {
    etag: boolean;
    lastModified: boolean;
    cacheControl: boolean;
  };
}

export interface CompressionConfig {
  gzip: {
    enabled: boolean;
    level: number; // 1-9
    types: string[];
  };
  brotli: {
    enabled: boolean;
    quality: number; // 1-11
    types: string[];
  };
}

export interface OptimizationConfig {
  images: {
    formats: string[]; // webp, avif, jpeg, png
    quality: number; // 75-95
    responsive: boolean;
    lazy: boolean;
  };
  css: {
    minify: boolean;
    purge: boolean;
    critical: boolean;
  };
  js: {
    minify: boolean;
    tree_shake: boolean;
    code_split: boolean;
  };
}

export interface SecurityConfig {
  ssl: {
    provider: 'letsencrypt' | 'cloudflare' | 'custom' | 'firebase';
    hsts: boolean;
    redirect: boolean; // HTTP to HTTPS
  };
  headers: {
    csp: string;
    xfo: string; // X-Frame-Options
    xss: string; // X-XSS-Protection
    referrer: string;
  };
  firewall: {
    enabled: boolean;
    rules: string[];
    rateLimiting: {
      requests: number;
      window: number; // seconds
    };
  };
}

export interface MonitoringConfig {
  uptime: {
    provider: 'uptimerobot' | 'pingdom' | 'custom' | 'firebase-performance';
    interval: number; // minutes
    locations: string[];
  };
  analytics: {
    google: {
      measurementId: string;
      enhanced: boolean;
    };
    performance: {
      core_web_vitals: boolean;
      real_user_monitoring: boolean;
    };
  };
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    retention: number; // days
    alerts: boolean;
  };
}

/**
 * Production configurations for different hosting providers
 */
export const productionConfigs: Record<string, ProductionConfig> = {
  netlify: {
    hosting: {
      primary: {
        name: 'netlify',
        config: {
          buildCommand: 'npm run build && npm run export',
          publishDirectory: 'out',
          nodeVersion: '20',
          environmentVariables: {
            'NEXT_PUBLIC_SITE_URL': 'https://archbuilder.ai',
            'NEXT_PUBLIC_GA_MEASUREMENT_ID': 'G-XXXXXXXXXX',
            'NODE_ENV': 'production'
          },
          redirects: [
            {
              from: '/home',
              to: '/',
              status: 301
            },
            {
              from: '/index.html',
              to: '/',
              status: 301
            },
            {
              from: '/.well-known/security.txt',
              to: '/security.txt',
              status: 200
            }
          ],
          headers: [
            {
              for: '/*',
              values: {
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
              }
            },
            {
              for: '/assets/*',
              values: {
                'Cache-Control': 'public, max-age=31536000, immutable'
              }
            }
          ]
        }
      },
      cdn: {
        name: 'netlify-cdn',
        config: {
          zones: ['global'],
          cacheRules: [
            {
              path: '/assets/*',
              ttl: 31536000, // 1 year
              edgeTtl: 31536000,
              browserTtl: 31536000
            },
            {
              path: '*.html',
              ttl: 3600, // 1 hour
              edgeTtl: 3600,
              browserTtl: 0
            }
          ],
          purgeStrategy: 'auto',
          edgeLocations: ['global']
        }
      },
      dns: {
        name: 'netlify'
      },
      ssl: {
        name: 'letsencrypt'
      }
    },
    domains: {
      primary: 'archbuilder.ai',
      www: 'www.archbuilder.ai',
      redirects: ['archbuilderai.com', 'arch-builder.ai']
    },
    performance: {
      caching: {
        staticAssets: {
          css: 31536000, // 1 year
          js: 31536000, // 1 year
          images: 15552000, // 6 months
          fonts: 31536000 // 1 year
        },
        pages: {
          html: 3600, // 1 hour
          api: 300, // 5 minutes
          sitemap: 86400 // 1 day
        },
        headers: {
          etag: true,
          lastModified: true,
          cacheControl: true
        }
      },
      compression: {
        gzip: {
          enabled: true,
          level: 6,
          types: ['text/html', 'text/css', 'text/javascript', 'application/javascript', 'application/json']
        },
        brotli: {
          enabled: true,
          quality: 6,
          types: ['text/html', 'text/css', 'text/javascript', 'application/javascript', 'application/json']
        }
      },
      optimization: {
        images: {
          formats: ['webp', 'avif', 'jpeg', 'png'],
          quality: 85,
          responsive: true,
          lazy: true
        },
        css: {
          minify: true,
          purge: true,
          critical: true
        },
        js: {
          minify: true,
          tree_shake: true,
          code_split: true
        }
      }
    },
    security: {
      ssl: {
        provider: 'letsencrypt',
        hsts: true,
        redirect: true
      },
      headers: {
        csp: "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://firestore.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com",
        xfo: 'DENY',
        xss: '1; mode=block',
        referrer: 'strict-origin-when-cross-origin'
      },
      firewall: {
        enabled: true,
        rules: ['block-known-bots', 'rate-limit'],
        rateLimiting: {
          requests: 100,
          window: 60
        }
      }
    },
    monitoring: {
      uptime: {
        provider: 'uptimerobot',
        interval: 5,
        locations: ['us-east', 'eu-west', 'asia-pacific']
      },
      analytics: {
        google: {
          measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
          enhanced: true
        },
        performance: {
          core_web_vitals: true,
          real_user_monitoring: true
        }
      },
      logging: {
        level: 'error',
        retention: 30,
        alerts: true
      }
    }
  },

  firebase: {
    hosting: {
      primary: {
        name: 'firebase',
        config: {
          buildCommand: 'npm run build',
          publishDirectory: 'out',
          nodeVersion: '20',
          environmentVariables: {
            'NEXT_PUBLIC_SITE_URL': 'https://archbuilder.ai',
            'NEXT_PUBLIC_GA_MEASUREMENT_ID': 'G-XXXXXXXXXX',
            'NODE_ENV': 'production'
          },
          redirects: [
            {
              from: '/home',
              to: '/',
              status: 301
            },
            {
              from: '/index.html',
              to: '/',
              status: 301
            }
          ],
          headers: [
            {
              for: '**',
              values: {
                'X-Frame-Options': 'DENY',
                'X-XSS-Protection': '1; mode=block',
                'X-Content-Type-Options': 'nosniff',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Content-Security-Policy': "default-src 'self'; script-src 'self' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://firestore.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com"
              }
            },
            {
              for: '**/*.@(js|css|woff2)',
              values: {
                'Cache-Control': 'public, max-age=31536000, immutable'
              }
            }
          ]
        }
      },
      cdn: {
        name: 'firebase-cdn',
        config: {
          zones: ['global'],
          cacheRules: [
            {
              path: '**/*.@(js|css|woff2)',
              ttl: 31536000,
              edgeTtl: 31536000,
              browserTtl: 31536000
            },
            {
              path: '**/*.html',
              ttl: 3600,
              edgeTtl: 3600,
              browserTtl: 0
            }
          ],
          purgeStrategy: 'auto',
          edgeLocations: ['global']
        }
      },
      dns: {
        name: 'firebase'
      },
      ssl: {
        name: 'firebase'
      }
    },
    domains: {
      primary: 'archbuilder.ai',
      www: 'www.archbuilder.ai',
      redirects: []
    },
    performance: {
      caching: {
        staticAssets: {
          css: 31536000,
          js: 31536000,
          images: 15552000,
          fonts: 31536000
        },
        pages: {
          html: 3600,
          api: 300,
          sitemap: 86400
        },
        headers: {
          etag: true,
          lastModified: true,
          cacheControl: true
        }
      },
      compression: {
        gzip: {
          enabled: true,
          level: 6,
          types: ['text/html', 'text/css', 'application/javascript']
        },
        brotli: {
          enabled: true,
          quality: 6,
          types: ['text/html', 'text/css', 'application/javascript']
        }
      },
      optimization: {
        images: {
          formats: ['webp', 'avif'],
          quality: 85,
          responsive: true,
          lazy: true
        },
        css: {
          minify: true,
          purge: true,
          critical: true
        },
        js: {
          minify: true,
          tree_shake: true,
          code_split: true
        }
      }
    },
    security: {
      ssl: {
        provider: 'firebase',
        hsts: true,
        redirect: true
      },
      headers: {
        csp: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://firestore.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com",
        xfo: 'DENY',
        xss: '1; mode=block',
        referrer: 'strict-origin-when-cross-origin'
      },
      firewall: {
        enabled: true,
        rules: [],
        rateLimiting: {
          requests: 100,
          window: 60
        }
      }
    },
    monitoring: {
      uptime: {
        provider: 'firebase-performance',
        interval: 1,
        locations: ['global']
      },
      analytics: {
        google: {
          measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
          enhanced: true
        },
        performance: {
          core_web_vitals: true,
          real_user_monitoring: true
        }
      },
      logging: {
        level: 'error',
        retention: 30,
        alerts: true
      }
    }
  },

  vercel: {
    hosting: {
      primary: {
        name: 'vercel',
        config: {
          buildCommand: 'npm run build',
          publishDirectory: '.next',
          nodeVersion: '20',
          environmentVariables: {
            'NEXT_PUBLIC_SITE_URL': 'https://archbuilder.ai',
            'NEXT_PUBLIC_GA_MEASUREMENT_ID': 'G-XXXXXXXXXX'
          },
          redirects: [
            {
              from: '/home',
              to: '/',
              status: 308
            }
          ],
          headers: [
            {
              for: '/(.*)',
              values: {
                'X-Frame-Options': 'DENY'
              }
            }
          ]
        }
      },
      cdn: {
        name: 'vercel-edge',
        config: {
          zones: ['iad1', 'fra1', 'hnd1'],
          cacheRules: [
            {
              path: '/_next/static/*',
              ttl: 31536000
            }
          ],
          purgeStrategy: 'auto',
          edgeLocations: ['global']
        }
      },
      dns: {
        name: 'vercel'
      },
      ssl: {
        name: 'letsencrypt'
      }
    },
    domains: {
      primary: 'archbuilder.ai',
      www: 'www.archbuilder.ai',
      redirects: []
    },
    performance: {
      caching: {
        staticAssets: {
          css: 31536000,
          js: 31536000,
          images: 15552000,
          fonts: 31536000
        },
        pages: {
          html: 3600,
          api: 300,
          sitemap: 86400
        },
        headers: {
          etag: true,
          lastModified: true,
          cacheControl: true
        }
      },
      compression: {
        gzip: {
          enabled: true,
          level: 6,
          types: ['text/html', 'text/css', 'application/javascript']
        },
        brotli: {
          enabled: true,
          quality: 6,
          types: ['text/html', 'text/css', 'application/javascript']
        }
      },
      optimization: {
        images: {
          formats: ['webp', 'avif'],
          quality: 85,
          responsive: true,
          lazy: true
        },
        css: {
          minify: true,
          purge: true,
          critical: true
        },
        js: {
          minify: true,
          tree_shake: true,
          code_split: true
        }
      }
    },
    security: {
      ssl: {
        provider: 'letsencrypt',
        hsts: true,
        redirect: true
      },
      headers: {
        csp: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://firestore.googleapis.com https://www.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://firebaseinstallations.googleapis.com",
        xfo: 'DENY',
        xss: '1; mode=block',
        referrer: 'strict-origin-when-cross-origin'
      },
      firewall: {
        enabled: true,
        rules: [],
        rateLimiting: {
          requests: 100,
          window: 60
        }
      }
    },
    monitoring: {
      uptime: {
        provider: 'pingdom',
        interval: 1,
        locations: ['us', 'eu', 'asia']
      },
      analytics: {
        google: {
          measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
          enhanced: true
        },
        performance: {
          core_web_vitals: true,
          real_user_monitoring: true
        }
      },
      logging: {
        level: 'error',
        retention: 30,
        alerts: true
      }
    }
  }
};

/**
 * Deploy configuration generator
 */
export class ProductionDeployment {
  private config: ProductionConfig;

  constructor(provider: keyof typeof productionConfigs) {
    this.config = productionConfigs[provider];
  }

  /**
   * Generate Netlify deployment files
   */
  generateNetlifyConfig(): {
    '_netlify.toml': string;
    '_redirects': string;
    '_headers': string;
  } {
    const toml = `[build]
  command = "${this.config.hosting.primary.config.buildCommand}"
  publish = "${this.config.hosting.primary.config.publishDirectory}"

[build.environment]
${Object.entries(this.config.hosting.primary.config.environmentVariables)
  .map(([key, value]) => `  ${key} = "${value}"`)
  .join('\n')}

[[redirects]]
${this.config.hosting.primary.config.redirects
  .map(redirect => `  from = "${redirect.from}"
  to = "${redirect.to}"
  status = ${redirect.status}`)
  .join('\n\n[[redirects]]\n')}

[[headers]]
${this.config.hosting.primary.config.headers
  .map(header => `  for = "${header.for}"
  [headers.values]
${Object.entries(header.values)
  .map(([key, value]) => `    ${key} = "${value}"`)
  .join('\n')}`)
  .join('\n\n[[headers]]\n')}`;

    const redirects = this.config.hosting.primary.config.redirects
      .map(redirect => `${redirect.from} ${redirect.to} ${redirect.status}${redirect.force ? '!' : ''}`)
      .join('\n');

    const headers = this.config.hosting.primary.config.headers
      .map(header => `${header.for}\n${Object.entries(header.values)
        .map(([key, value]) => `  ${key}: ${value}`)
        .join('\n')}`)
      .join('\n\n');

    return {
      '_netlify.toml': toml,
      '_redirects': redirects,
      '_headers': headers
    };
  }

  /**
   * Generate Vercel deployment files
   */
  generateVercelConfig(): {
    'vercel.json': string;
  } {
    const config = {
      version: 2,
      builds: [
        {
          src: 'package.json',
          use: '@vercel/next'
        }
      ],
      env: this.config.hosting.primary.config.environmentVariables,
      redirects: this.config.hosting.primary.config.redirects.map(redirect => ({
        source: redirect.from,
        destination: redirect.to,
        permanent: redirect.status === 301 || redirect.status === 308
      })),
      headers: this.config.hosting.primary.config.headers.map(header => ({
        source: header.for,
        headers: Object.entries(header.values).map(([key, value]) => ({
          key,
          value
        }))
      }))
    };

    return {
      'vercel.json': JSON.stringify(config, null, 2)
    };
  }

  /**
   * Generate Docker deployment files
   */
  generateDockerConfig(): {
    'Dockerfile': string;
    'docker-compose.yml': string;
    '.dockerignore': string;
  } {
    const dockerfile = `# ArchBuilder.AI Website Docker Image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables for build
${Object.entries(this.config.hosting.primary.config.environmentVariables)
  .map(([key, value]) => `ENV ${key}="${value}"`)
  .join('\n')}

RUN npm run build && npm run export

# Production image, copy all the files and run nginx
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy the exported static files
COPY --from=builder /app/out .
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]`;

    const dockerCompose = `version: '3.8'
services:
  archbuilder-web:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
    environment:
${Object.entries(this.config.hosting.primary.config.environmentVariables)
  .map(([key, value]) => `      - ${key}=${value}`)
  .join('\n')}
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.archbuilder.rule=Host(\`${this.config.domains.primary}\`)"
      - "traefik.http.routers.archbuilder.tls=true"
      - "traefik.http.routers.archbuilder.tls.certresolver=letsencrypt"`;

    const dockerignore = `node_modules
.next
.git
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
*.tgz
*.tar.gz`;

    return {
      'Dockerfile': dockerfile,
      'docker-compose.yml': dockerCompose,
      '.dockerignore': dockerignore
    };
  }

  /**
   * Generate deployment checklist
   */
  generateDeploymentChecklist(): string {
    return `# ArchBuilder.AI Production Deployment Checklist

## Pre-Deployment
- [ ] Environment variables configured
- [ ] SSL certificates ready
- [ ] DNS records updated
- [ ] CDN configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy in place

## Domain Setup
- [ ] Primary domain: ${this.config.domains.primary}
- [ ] WWW redirect: ${this.config.domains.www}
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] HSTS headers configured

## Performance Optimization
- [ ] Static assets cached (${this.config.performance.caching.staticAssets.css}s)
- [ ] Gzip compression enabled
- [ ] Brotli compression enabled
- [ ] Image optimization configured
- [ ] CSS/JS minification enabled

## Security Configuration
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] Rate limiting enabled
- [ ] Firewall rules applied
- [ ] SSL/TLS properly configured

## Monitoring Setup
- [ ] Uptime monitoring configured (${this.config.monitoring.uptime.provider})
- [ ] Google Analytics installed
- [ ] Core Web Vitals tracking enabled
- [ ] Error logging configured
- [ ] Alert notifications set up

## Post-Deployment Verification
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified
- [ ] Cross-browser compatibility tested
- [ ] SEO tags and sitemap accessible
- [ ] Analytics tracking working
- [ ] Performance scores acceptable (Lighthouse ≥90)
- [ ] Security headers verified
- [ ] SSL certificate valid
- [ ] CDN caching working

## Rollback Plan
- [ ] Previous version backup available
- [ ] Rollback procedure documented
- [ ] DNS TTL reduced for quick changes
- [ ] Emergency contact list updated`;
  }
}

export const deployment = new ProductionDeployment('netlify');