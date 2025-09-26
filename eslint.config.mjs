import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "out/_next/**",
      ".next/**.*",
      ".next/",
      ".turbo/**",
      ".cache/**",
      "coverage/**",
      ".jest-cache/**",
      ".nyc_output/**",
      ".vercel/**",
      "public/generated/**",
      "scripts/out/**",
      "build/**",
      "dist/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "src/types/stripe.ts",
      "src/lib/stripe-api.ts",
      "src/lib/stripe-config.ts",
      "src/components/sections/pricing-enhanced.tsx",
      "src/components/sections/marketplace.tsx",
      "src/app/payment/success/payment-success-content.tsx",
      "src/app/payment/canceled/payment-canceled-content.tsx"
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { "argsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
  {
    files: ["src/**/*stripe*", "src/app/payment/**/*", "src/components/sections/pricing-enhanced.tsx", "src/components/sections/marketplace.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
    },
  },
];

export default eslintConfig;
