# Stripe Dashboard Setup Guide
# Stripe Dashboard Kurulum Kılavuzu

Bu kılavuz, Stripe Dashboard'da ürünler ve fiyatlar oluşturarak gerçek price ID'leri almak için hazırlanmıştır.

## 1. Stripe Dashboard'a Giriş

1. [https://dashboard.stripe.com](https://dashboard.stripe.com) adresine gidin
2. Test mode'da olduğunuzdan emin olun (sol üst köşede "Test mode" yazan toggle aktif olmalı)
3. Sol menüden **Products** seçeneğini tıklayın

## 2. Subscription Products Oluşturma

### A) Professional Plan

1. **"+ Add product"** butonuna tıklayın
2. Şu bilgileri doldurun:
   - **Name**: ArchBuilder.AI Professional
   - **Description**: Professional plan for architects and small offices
   - **Image**: Logo upload (opsiyonel)

3. **Pricing** bölümünde:
   - **Pricing model**: Standard pricing
   - **Price**: $29.00 USD
   - **Billing period**: Monthly
   - **Usage type**: Licensed (kullanıcı sayısı için)

4. **Create product** butonuna tıklayın

5. Ürün sayfasında **"+ Add another price"** tıklayın:
   - **Price**: $290.00 USD (10 month * $29 = 20% indirim)
   - **Billing period**: Yearly
   - **Create price** tıklayın

### B) Enterprise Plan

1. **"+ Add product"** butonuna tıklayın
2. Şu bilgileri doldurun:
   - **Name**: ArchBuilder.AI Enterprise
   - **Description**: Enterprise plan for large offices and corporations
   
3. **Pricing** bölümünde:
   - **Pricing model**: Standard pricing
   - **Price**: $99.00 USD
   - **Billing period**: Monthly

4. **Create product** butonuna tıklayın

5. Yearly price ekleyin:
   - **Price**: $990.00 USD (10 month * $99 = 20% indirim)
   - **Billing period**: Yearly

### C) Starter Plan (Ücretsiz/Gelecek)

Şimdilik sadece placeholder olarak:
1. **"+ Add product"** butonuna tıklayın
2. **Name**: ArchBuilder.AI Starter
3. **Price**: $0.00 USD (veya $9.99 future pricing için)

## 3. One-Time Products Oluşturma

### A) AI Credits

1. **"+ Add product"** → **Name**: ArchBuilder.AI Credits
2. Üç farklı fiyat ekleyin:
   - **10 Credits**: $19.99 USD (One-time)
   - **50 Credits**: $79.99 USD (One-time) 
   - **100 Credits**: $149.99 USD (One-time)

### B) Templates

1. **"+ Add product"** → **Name**: ArchBuilder.AI Templates
2. **Price**: $49.99 USD (One-time)

### C) Consultation

1. **"+ Add product"** → **Name**: ArchBuilder.AI Consultation
2. **Price**: $199.99 USD (One-time)

## 4. Price ID'leri Kopyalama

Her ürün/fiyat oluşturduktan sonra:

1. **Products** sayfasında ürüne tıklayın
2. Her fiyatın yanında **price_xxx** şeklinde ID görünür
3. Bu ID'leri kopyalayıp environment variables'a ekleyin:

```bash
# Professional Plan
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PROFESSIONAL_PRICE_ID=price_1xxxxx
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PROFESSIONAL_YEARLY_PRICE_ID=price_1yyyyy

# Enterprise Plan  
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_ENTERPRISE_PRICE_ID=price_1zzzzz
NEXT_PUBLIC_STRIPE_SUBSCRIPTION_ENTERPRISE_YEARLY_PRICE_ID=price_1wwwww

# One-time Products
NEXT_PUBLIC_STRIPE_PRODUCT_CREDITS_10_PRICE_ID=price_1aaaaa
NEXT_PUBLIC_STRIPE_PRODUCT_CREDITS_50_PRICE_ID=price_1bbbbb
NEXT_PUBLIC_STRIPE_PRODUCT_CREDITS_100_PRICE_ID=price_1ccccc
NEXT_PUBLIC_STRIPE_PRODUCT_TEMPLATES_PRICE_ID=price_1ddddd
NEXT_PUBLIC_STRIPE_PRODUCT_CONSULTATION_PRICE_ID=price_1eeeee
```

## 5. GitHub Secrets Güncelleme

Gerçek price ID'leri aldıktan sonra:

```bash
gh secret set NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PROFESSIONAL_PRICE_ID --body "price_1xxxxx"
gh secret set NEXT_PUBLIC_STRIPE_SUBSCRIPTION_ENTERPRISE_PRICE_ID --body "price_1zzzzz"
# ... diğer price ID'ler
```

## 6. Webhook Configuration (İleride)

Production için webhook endpoint kurulumu:
1. **Developers** → **Webhooks** → **Add endpoint**
2. **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
3. **Events**: `checkout.session.completed`, `invoice.payment_succeeded`

## 7. Test Kartları

Test için kullanabileceğiniz kartlar:
- **Successful**: 4242 4242 4242 4242
- **Declined**: 4000 0000 0000 0002
- **3D Secure**: 4000 0000 0000 3220

## 8. Production'a Geçiş

1. Stripe Dashboard'da **Live mode** aktif edin
2. Live keys'leri alın
3. GitHub secrets'ları live keys ile güncelleyin
4. Webhook'ları live environment'a kurun

---

**Not**: Bu kılavuz test environment için hazırlanmıştır. Production'da real payment işlemlerinde dikkatli olun!