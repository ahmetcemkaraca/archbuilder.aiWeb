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
      "build/**", 
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
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn", // Changed from error to warn
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];

export default eslintConfig;
