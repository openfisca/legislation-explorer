module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'arrow-spacing': ['error', {before: true, after: true}],
    'eol-last': 'error',
    indent: ['error', 2],
    'jsx-quotes': ['error', 'prefer-double'],
    'key-spacing': ['error', {beforeColon: false, afterColon: true}],
    'keyword-spacing': ['error', {before: true, after: true}],
    'no-console': 'off',
    'no-trailing-spaces': 'error',
    quotes: ['error', 'single', {avoidEscape: true}],
    'react/prop-types': 'off',
    semi: ['error', 'never'],
    'space-before-blocks': ['error', 'always'],
    'space-infix-ops': 'error',
    'react/jsx-no-target-blank': ['off'],
  },
  plugins: ['react'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
}
