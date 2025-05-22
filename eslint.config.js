import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  {
    files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser },

    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'group', 'groupEnd', 'debug' ,'groupCollapsed'] }],
      'semi': ['error', 'never'],
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      
    }
  },
  tseslint.configs.recommended,
])