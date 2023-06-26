module.exports = {
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  rules: {
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
