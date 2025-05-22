import globals from "globals"
import parser from "@typescript-eslint/parser"
import pluginTs from "@typescript-eslint/eslint-plugin"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: globals.browser,
    },
    plugins: {
      "@typescript-eslint": pluginTs
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
      "no-console": ["warn", { allow: ["warn", "error", "info", "debug", "group", "groupEnd", "groupCollapsed"] }],
      "semi": ["error", "never"],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "@typescript-eslint/explicit-function-return-type": "off"
    }
  }
])
