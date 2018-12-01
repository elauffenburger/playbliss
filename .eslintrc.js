module.exports = {
  root: true,
  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module',
    parser: 'typescript-eslint-parser',
  },

  env: {
    browser: true,
    node: true,
  },

  extends: 'airbnb-base',

  globals: {
    __static: true,
  },

  plugins: [
    'html',
  ],

  rules: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],

  rules: {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },

  'extends': [
    '@vue/typescript'
  ]
};
