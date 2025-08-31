const glossary = require('./glossary.json');

const restrictedTerms = Object.entries(glossary).flatMap(([wrong, right]) => [
  {
    selector: `Literal[value=/\\b${wrong}\\b/]`,
    message: `Use '${right}' instead of '${wrong}'.`,
  },
  {
    selector: `TemplateElement[value.raw=/\\b${wrong}\\b/]`,
    message: `Use '${right}' instead of '${wrong}'.`,
  },
]);

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
    'no-restricted-syntax': ['error', ...restrictedTerms],
  },
};
