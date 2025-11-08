import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

const reactConfig = {
  files: ["**/*.{ts,tsx,js,jsx}"],
  plugins: {
    react,
    "react-hooks": reactHooks,
  },
  rules: {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

export default [
  {
    ignores: ["dist", "storybook-static"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactConfig,
  prettier,
];
