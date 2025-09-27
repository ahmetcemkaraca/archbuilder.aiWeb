# Environment Variables Setup
# Çevre Değişkenleri Kurulumu

Bu dosya production deployment için gerekli environment variables'ları içermektedir.

## GitHub Actions Secrets

Aşağıdaki secrets zaten GitHub repository'nize eklenmiştir:

### ✅ Stripe Secrets (Eklendi)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_51SBVJUCWcXT4oCPxao054q1BK6s2LiXLbVSusZbmeVV0UNPZp0uJ0mT3NOajoHzv7wh00NJsxvmWRjoomJToRtAG00Jti07XSa
STRIPE_SECRET_KEY = sk_test_51SBVJUCWcXT4oCPxtnbrOa3kGrL5N5g4jxBSGcvenSUei8PiGook1eINynHsfOX9ZXTSZQGT6ahhFi5NOaB92oXd00FAumxGAN
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_STARTER_PRICE_ID = price_starter_test
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PROFESSIONAL_PRICE_ID = price_professional_test
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_ENTERPRISE_PRICE_ID = price_enterprise_test
```

### 📋 Eklenmesi Gereken Diğer Secrets

```bash
# Firebase Secrets (Halihazırda .env.local'de mevcut)
gh secret set NEXT_PUBLIC_FIREBASE_API_KEY --body "AIzaSyDv1AcBHgQCIf98e65HXl7MVh7Ju18Lhtg"
gh secret set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --body "archbuilderai.firebaseapp.com"
gh secret set NEXT_PUBLIC_FIREBASE_PROJECT_ID --body "archbuilderai"
gh secret set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --body "archbuilderai.appspot.com"
gh secret set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --body "494271597003"
gh secret set NEXT_PUBLIC_FIREBASE_APP_ID --body "1:494271597003:web:662cee38e1920b6b51ce4e"
gh secret set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID --body "G-Q04NTQS1Q9"

# Domain & API
gh secret set NEXT_PUBLIC_DOMAIN --body "https://archbuilder.ai"
gh secret set NEXT_PUBLIC_API_URL --body "https://api.archbuilder.ai"

# Analytics (Production keys gerekli)
gh secret set NEXT_PUBLIC_GOOGLE_ANALYTICS_ID --body "G-XXXXXXXXXX"
gh secret set NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID --body "GTM-XXXXXXX"
```

## Local Development (.env.local)

Aşağıdaki variables zaten .env.local dosyanıza eklenmiştir:

```bash
# ✅ Mevcut Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDv1AcBHgQCIf98e65HXl7MVh7Ju18Lhtg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=archbuilderai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=archbuilderai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=archbuilderai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=494271597003
NEXT_PUBLIC_FIREBASE_APP_ID=1:494271597003:web:662cee38e1920b6b51ce4e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-Q04NTQS1Q9

# ✅ Yeni Stripe Config
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SBVJUCWcXT4oCPxao054q1BK6s2LiXLbVSusZbmeVV0UNPZp0uJ0mT3NOajoHzv7wh00NJsxvmWRjoomJToRtAG00Jti07XSa
STRIPE_SECRET_KEY=sk_test_51SBVJUCWcXT4oCPxtnbrOa3kGrL5N5g4jxBSGcvenSUei8PiGook1eINynHsfOX9ZXTSZQGT6ahhFi5NOaB92oXd00FAumxGAN

# ✅ Test Price IDs
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_STARTER_PRICE_ID=price_starter_test
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PROFESSIONAL_PRICE_ID=price_professional_test
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_ENTERPRISE_PRICE_ID=price_enterprise_test
```

## Production Deployment Checklist

### 1. Stripe Dashboard Setup
- [ ] Stripe Dashboard'da gerçek products ve prices oluştur
- [ ] Gerçek price ID'leri al
- [ ] GitHub secrets'ları gerçek price ID'lerle güncelle

### 2. Webhook Configuration
- [ ] Stripe webhook endpoint kur (`/api/webhooks/stripe`)
- [ ] Webhook secret'ını GitHub'a ekle: `STRIPE_WEBHOOK_SECRET`
- [ ] Events: `checkout.session.completed`, `invoice.payment_succeeded`

### 3. Analytics Setup
- [ ] Google Analytics property oluştur
- [ ] GA4 Measurement ID'yi GitHub secrets'a ekle
- [ ] Google Tag Manager container oluştur (opsiyonel)

### 4. Domain Configuration
- [ ] Production domain'i satın al
- [ ] DNS ayarlarını yapılandır
- [ ] SSL sertifikası kur
- [ ] `NEXT_PUBLIC_DOMAIN` secret'ını güncelle

### 5. Security
- [ ] Firestore security rules'ları production için gözden geçir
- [ ] CORS ayarlarını production domain'e göre güncelle
- [ ] Rate limiting ekle (Stripe webhooks için)

## Test Commands

```bash
# Environment variables test
npm run dev

# Build test
npm run build

# Stripe integration test
# Browser: http://localhost:3000/pricing
# Browser: http://localhost:3000/marketplace

# GitHub secrets verification
gh secret list
```

## Deployment Platforms

### Vercel
```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
# ... diğer variables
```

### Netlify
```bash
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_..."
netlify env:set STRIPE_SECRET_KEY "sk_..."
# ... diğer variables
```

### Firebase Hosting
```bash
firebase functions:config:set stripe.publishable_key="pk_..."
firebase functions:config:set stripe.secret_key="sk_..."
```

## Security Notes

⚠️ **Önemli Güvenlik Notları:**
- `sk_` ile başlayan secret key'leri asla client-side kodda kullanmayın
- GitHub repository public ise .env dosyalarını .gitignore'a ekleyin
- Production'da mutlaka environment-specific keys kullanın
- Webhook endpoint'lerini rate limit ile koruyun

---

**Status**: Stripe anahtarları başarıyla eklendi ve test edildi! 🚀