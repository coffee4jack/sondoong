import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  js.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.{js,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { varsIgnorePattern: "^[A-Z_]", argsIgnorePattern: "^_" }],
      // Los componentes de una sola palabra (Button, Card, Chip...) son intencionales
      "vue/multi-word-component-names": "off",
      // Los iconos SVG son cadenas estáticas definidas en el código, nunca entrada del usuario
      "vue/no-v-html": "off",
      // El formato lo controla Prettier, así que se desactivan las reglas de estilo que chocan con él
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
    },
  },
];
