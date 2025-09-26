/**
 * ArchBuilder.AI Product & Subscription Types
 * Ürün, abonelik ve ödeme türleri tanımları
 */

import { z } from 'zod';

// Abonelik seviyelerini tanımla
export enum SubscriptionTier {
  FREE = 'free',
  PROFESSIONAL = 'professional', 
  ENTERPRISE = 'enterprise',
  CUSTOM = 'custom'
}

// Ödeme durumları
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded'
}

// Abonelik durumları
export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNPAID = 'unpaid',
  TRIALING = 'trialing'
}

// Ürün türleri
export enum ProductType {
  SUBSCRIPTION = 'subscription',
  ONE_TIME = 'one_time',
  ADDON = 'addon',
  CUSTOM = 'custom'
}

// Fatura döngüsü
export enum BillingInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  QUARTERLY = 'quarterly'
}

// Zod şema tanımları
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  type: z.nativeEnum(ProductType),
  tier: z.nativeEnum(SubscriptionTier).optional(),
  stripeProductId: z.string().optional(),
  stripePriceId: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().default('usd'),
  billingInterval: z.nativeEnum(BillingInterval).optional(),
  features: z.array(z.string()).default([]),
  limits: z.record(z.union([z.number(), z.string(), z.boolean()])).default({}),
  isPopular: z.boolean().default(false),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  tier: z.nativeEnum(SubscriptionTier),
  status: z.nativeEnum(SubscriptionStatus),
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  billingInterval: z.nativeEnum(BillingInterval),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean().default(false),
  trialEnd: z.date().optional(),
  price: z.number(),
  currency: z.string().default('usd'),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export const PaymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subscriptionId: z.string().optional(),
  productId: z.string(),
  amount: z.number().min(0),
  currency: z.string().default('usd'),
  status: z.nativeEnum(PaymentStatus),
  stripePaymentIntentId: z.string().optional(),
  stripeSessionId: z.string().optional(),
  paymentMethod: z.string(),
  description: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date())
});

export const UsageTrackingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subscriptionId: z.string(),
  operationType: z.string(), // 'ai_layouts', 'building_scans', 'api_calls' vb.
  count: z.number().min(0),
  period: z.string(), // YYYY-MM formatında
  timestamp: z.date().default(() => new Date()),
  metadata: z.record(z.any()).optional()
});

// TypeScript türleri (Zod'dan çıkarılmış)
export type Product = z.infer<typeof ProductSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type UsageTracking = z.infer<typeof UsageTrackingSchema>;

// Abonelik limitleri ve özellikleri
export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, any> = {
  [SubscriptionTier.FREE]: {
    aiLayoutsPerMonth: 5,
    buildingScansPerMonth: 2,
    maxProjectSizeSqm: 200,
    apiCallsPerHour: 10,
    supportLevel: 'community',
    features: ['basic_layout', 'simple_validation', 'pdf_export'],
    maxProjects: 3,
    collaborators: 0,
    cloudStorage: '100MB'
  },
  [SubscriptionTier.PROFESSIONAL]: {
    aiLayoutsPerMonth: 100,
    buildingScansPerMonth: 20,
    maxProjectSizeSqm: 2000,
    apiCallsPerHour: 100,
    supportLevel: 'email',
    features: [
      'advanced_layout', 'code_compliance', '3d_visualization', 
      'export_formats', 'revit_plugin', 'team_collaboration'
    ],
    maxProjects: 25,
    collaborators: 5,
    cloudStorage: '10GB'
  },
  [SubscriptionTier.ENTERPRISE]: {
    aiLayoutsPerMonth: -1, // Sınırsız
    buildingScansPerMonth: -1, // Sınırsız
    maxProjectSizeSqm: -1, // Sınırsız
    apiCallsPerHour: 1000,
    supportLevel: 'priority',
    features: [
      'all_features', 'custom_models', 'white_label', 
      'sso', 'dedicated_support', 'api_access', 'webhooks'
    ],
    maxProjects: -1, // Sınırsız
    collaborators: -1, // Sınırsız
    cloudStorage: '100GB'
  },
  [SubscriptionTier.CUSTOM]: {
    aiLayoutsPerMonth: 'negotiated',
    buildingScansPerMonth: 'negotiated',
    maxProjectSizeSqm: 'negotiated',
    apiCallsPerHour: 'negotiated',
    supportLevel: 'dedicated',
    features: ['custom_requirements'],
    maxProjects: 'negotiated',
    collaborators: 'negotiated',
    cloudStorage: 'negotiated'
  }
};

// Abonelik fiyat planları
export const SUBSCRIPTION_PRICING: Record<SubscriptionTier, any> = {
  [SubscriptionTier.FREE]: {
    monthlyPriceUsd: 0,
    yearlyPriceUsd: 0,
    setupFeeUsd: 0,
    stripePriceIds: {
      monthly: null,
      yearly: null
    }
  },
  [SubscriptionTier.PROFESSIONAL]: {
    monthlyPriceUsd: 49,
    yearlyPriceUsd: 490, // 2 ay ücretsiz (%17 indirim)
    setupFeeUsd: 0,
    stripePriceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID,
      yearly: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID
    }
  },
  [SubscriptionTier.ENTERPRISE]: {
    monthlyPriceUsd: 199,
    yearlyPriceUsd: 1990, // 2 ay ücretsiz (%17 indirim)
    setupFeeUsd: 500,
    stripePriceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
      yearly: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_YEARLY_PRICE_ID
    }
  },
  [SubscriptionTier.CUSTOM]: {
    monthlyPriceUsd: 'negotiated',
    yearlyPriceUsd: 'negotiated',
    setupFeeUsd: 'negotiated',
    stripePriceIds: {
      monthly: null,
      yearly: null
    }
  }
};

// Tek seferlik ürünler (eklentiler, krediler vb.)
export const ONE_TIME_PRODUCTS = [
  {
    id: 'ai_credits_100',
    name: 'AI Layout Credits (100)',
    description: 'Ek 100 AI layout oluşturma kredisi',
    price: 29,
    credits: 100,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_100_PRICE_ID
  },
  {
    id: 'ai_credits_500',
    name: 'AI Layout Credits (500)', 
    description: 'Ek 500 AI layout oluşturma kredisi',
    price: 129,
    credits: 500,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_CREDITS_500_PRICE_ID
  },
  {
    id: 'premium_support',
    name: 'Premium Support Package',
    description: '1 aylık premium destek ve danışmanlık',
    price: 199,
    duration: 30, // gün
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_SUPPORT_PRICE_ID
  }
];

// Kullanım takibi türleri
export const USAGE_TYPES = {
  AI_LAYOUTS: 'ai_layouts',
  BUILDING_SCANS: 'building_scans', 
  API_CALLS: 'api_calls',
  EXPORTS: 'exports',
  COLLABORATIONS: 'collaborations',
  STORAGE_USED: 'storage_used'
} as const;

// Özellik anahtarları
export const FEATURE_FLAGS = {
  BASIC_LAYOUT: 'basic_layout',
  ADVANCED_LAYOUT: 'advanced_layout',
  CODE_COMPLIANCE: 'code_compliance',
  THREE_D_VISUALIZATION: '3d_visualization',
  EXPORT_FORMATS: 'export_formats',
  REVIT_PLUGIN: 'revit_plugin',
  TEAM_COLLABORATION: 'team_collaboration',
  API_ACCESS: 'api_access',
  WEBHOOKS: 'webhooks',
  WHITE_LABEL: 'white_label',
  SSO: 'sso',
  CUSTOM_MODELS: 'custom_models',
  DEDICATED_SUPPORT: 'dedicated_support'
} as const;

// Yardımcı fonksiyonlar
export const getSubscriptionFeatures = (tier: SubscriptionTier): string[] => {
  return SUBSCRIPTION_LIMITS[tier]?.features || [];
};

export const hasFeature = (tier: SubscriptionTier, feature: string): boolean => {
  const features = getSubscriptionFeatures(tier);
  return features.includes(feature) || features.includes('all_features');
};

export const getUsageLimit = (tier: SubscriptionTier, usageType: string): number => {
  const limits = SUBSCRIPTION_LIMITS[tier];
  if (!limits) return 0;
  
  const limitKey = `${usageType}PerMonth`;
  return limits[limitKey] || 0;
};

export const calculateYearlySavings = (tier: SubscriptionTier): number => {
  const pricing = SUBSCRIPTION_PRICING[tier];
  if (typeof pricing.monthlyPriceUsd !== 'number' || typeof pricing.yearlyPriceUsd !== 'number') {
    return 0;
  }
  
  const yearlyFromMonthly = pricing.monthlyPriceUsd * 12;
  const actualYearly = pricing.yearlyPriceUsd;
  return Math.max(0, yearlyFromMonthly - actualYearly);
};