import js from "@eslint/js";
import globals from "globals";
import sveltePlugin from "eslint-plugin-svelte";
import { defineConfig } from "eslint/config";

export default defineConfig([

  { ignores: ["**/dist/**", "**/node_modules/**"] },

  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
  },

  {
    files: ["client/**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },

]);