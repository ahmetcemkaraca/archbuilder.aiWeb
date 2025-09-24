# 🔥 Firebase Deployment Guide for ArchBuilder.AI

## Why Firebase?

Firebase Hosting bu proje için mükemmel çünkü:
- ✅ **Static Export** tam uyumlu
- ✅ **Ücretsiz Plan** (10GB + 125GB bandwidth)
- ✅ **Global CDN** worldwide performance
- ✅ **Auto SSL** ücretsiz sertifikalar
- ✅ **Custom Domains** kolay domain bağlama
- ✅ **Preview Channels** staging environments
- ✅ **GitHub Integration** otomatik deployment

## 🚀 Quick Start

### 1. Firebase CLI Kurulumu
```powershell
# Firebase CLI'yi global olarak yükle
npm install -g firebase-tools

# Firebase'e login ol
firebase login
```

### 2. Project Setup
```powershell
# Firebase projesini initialize et
firebase init hosting

# Şu ayarları seç:
# - Use an existing project: Kendi Firebase projenizi seçin
# - Public directory: out
# - Single-page app: Yes
# - Set up automatic builds: No (manuel olarak yapacağız)
```

### 3. Deploy
```powershell
# Production build oluştur
npm run build

# Firebase'e deploy et
firebase deploy --only hosting
```

## 📦 Otomatik Deployment

### PowerShell Script ile Deploy
```powershell
# Deploy script'ini çalıştır
.\scripts\deploy-firebase.ps1
```

Bu script:
- Firebase CLI kontrolü
- Login durumu kontrolü
- Production build
- Otomatik deployment
- Browser'da açma seçeneği

### GitHub Actions ile CI/CD
```yaml
# .github/workflows/firebase-deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [ main ]

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-firebase-project-id
```

## ⚙️ Configuration

### Firebase Hosting Configuration (`firebase.json`)
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|woff2|woff|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### Environment Variables
Firebase Console'da Environment Variables:
```
NEXT_PUBLIC_SITE_URL=https://your-project.web.app
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
```

## 🌐 Custom Domain Setup

### 1. Firebase Console'da Domain Ekleme
1. Firebase Console → Hosting
2. "Add custom domain" butonuna tıklayın
3. Domain'inizi girin (örn: `archbuilder.ai`)
4. DNS records'ları kopyalayın

### 2. DNS Configuration
Domain sağlayıcınızda şu record'ları ekleyin:
```
Type: A
Name: @
Value: 151.101.1.195
Value: 151.101.65.195

Type: CNAME
Name: www
Value: your-project.web.app
```

### 3. SSL Certificate
Firebase otomatik olarak Let's Encrypt sertifikası sağlar. Aktivasyon 24 saat sürebilir.

## 📊 Firebase Services Integration

### Firebase Analytics
```typescript
// Google Analytics yerine Firebase Analytics
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

### Firebase Performance Monitoring
```typescript
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);
// Otomatik olarak Core Web Vitals izler
```

## 🔧 Advanced Features

### Preview Channels (Staging)
```powershell
# Preview channel oluştur
firebase hosting:channel:deploy preview-branch-name

# PR preview (GitHub integration ile otomatik)
# Her PR için otomatik preview URL oluşur
```

### Firebase Functions (Gelecek için)
```powershell
# Functions kurulumu (opsiyonel)
firebase init functions

# API endpoints için
firebase deploy --only functions
```

### Firebase Database (İhtiyaç durumunda)
```powershell
# Firestore kurulumu
firebase init firestore

# Contact form verileri için
firebase deploy --only firestore
```

## 📈 Monitoring & Analytics

### Firebase Console Özellikleri
- **Performance**: Core Web Vitals, page load times
- **Analytics**: User behavior, demographics
- **Hosting**: Bandwidth usage, request counts
- **Alerts**: Performance degradation warnings

### Custom Monitoring
```typescript
// Performance tracking
import { trace } from 'firebase/performance';

const t = trace(perf, 'page-load');
t.start();
// Page load işlemleri
t.stop();
```

## 💰 Pricing & Limits

### Ücretsiz Plan (Spark)
- **Storage**: 10 GB
- **Bandwidth**: 125 GB/month
- **Custom domain**: 1 domain
- **SSL**: Ücretsiz

### Ücretli Plan (Blaze) - Pay as you go
- **Storage**: $0.026/GB
- **Bandwidth**: $0.15/GB
- **No limits** on projects

## 🚨 Migration from Other Platforms

### Netlify'den Firebase'e
1. `netlify.toml` → `firebase.json`
2. Environment variables → Firebase Console
3. Deploy script update
4. DNS records update

### Benefits
- **Better integration** with Google services
- **More predictable pricing**
- **Advanced monitoring** built-in
- **Global CDN** performance

## 🔍 Troubleshooting

### Common Issues

**Build failing on Firebase:**
```powershell
# Clear Next.js cache
rm -rf .next
npm run build
```

**Static export not working:**
```javascript
// next.config.ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
};
```

**Headers not applied:**
- Firebase headers work automatically
- No need for `.htaccess` or server config

### Support
- Firebase Support: https://firebase.google.com/support
- Community: https://stackoverflow.com/questions/tagged/firebase
- Documentation: https://firebase.google.com/docs/hosting

---

**🎉 Firebase deployment hazır!** Bu configuration ile ArchBuilder.AI full production-ready olarak Firebase'de host edilebilir.