module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript/base',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/no-dynamic-require': 0,
    'no-console': 0,
    'global-require': 0,
    'class-methods-use-this': 0,
    'import/no-extraneous-dependencies': 0,
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "CallExpression[callee.object.name='document'][callee.property.name=/querySelector(All)?/][arguments.0.value=/^(html|body|:root|\\*)/]",
        message: 'Global selectors are not allowed. Use scoped selectors instead.',
      },
    ],
  },
};
