module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
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
    'import/no-internal-modules': ['error', {
      forbid: ['axios/**', 'inversify/**', 'reflect-metadata/**'],
    }],
  },
};
