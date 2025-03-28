import vuePlugin from "eslint-plugin-vue";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

// Линтер чтобы не втыкали
export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
        node: true,
      },
    },
  },

  {
    plugins: {
      vue: vuePlugin,
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
  },

  {
    files: ["**/*.vue"],
    ...vuePlugin.configs["flat/recommended"],
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    ...tsPlugin.configs["flat/recommended"],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsPlugin.parser,
    }
  },

  eslintConfigPrettier,

  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "prettier/prettier": "error",
    },
  },
];
