module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    // "react/jsx-uses-react": "error",
    // "react/jsx-uses-vars": "error",
    // "react-hooks/exhaustive-deps": "warn",
    // "react-hooks/rules-of-hooks": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
