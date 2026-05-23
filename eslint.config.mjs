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

  ...sveltePlugin.configs["flat/recommended"],
  {
    files: ["**/*.svelte"],
    languageOptions: { globals: globals.browser },
  },
]);