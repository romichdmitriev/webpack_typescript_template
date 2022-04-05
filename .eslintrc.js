module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    files: ['*.ts', '*.tsx'],
    ecmaVersion: 8,
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true,
    },
    sourceType: 'module',
    project: ['tsconfig.json'],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'no-shadow': 'off',
    'import/no-cycle': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-shadow': 'off',
    'import/extensions': 0,
    'import/order': 0,
  },
};
