module.exports = {
  extends: ["plugin:vue/essential", "eslint:recommended"],
  plugins: ["vue"],
  rules: {
    "no-unused-vars": ["off"],
    "vue/no-unused-components": "off",
  },
  env: {
    node: true,
    browser: true,
    es6: true,
  },
};
