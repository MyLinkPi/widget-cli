module.exports = {
  extends: ["oclif", "oclif-typescript", "prettier"],
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": 1,
    camelcase: 0,
  },
};
