module.exports = {
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  rules: { "no-underscore-dangle": "warn" },
  "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
};
