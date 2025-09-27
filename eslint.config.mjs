import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Global ignores should be first and at the top level
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs", 
      "*.config.ts",
      "public/**",
      "__mocks__/**",
      "jest.setup.js",
      "scripts/**/*.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
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
