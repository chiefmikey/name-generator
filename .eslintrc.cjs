module.exports = {
  extends: [
    'airbnb-base',
    '@vue/airbnb',
    'plugin:vue/vue3-recommended',
    'plugin:sonarjs/recommended',
    'plugin:compat/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': ['error'],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'func-names': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
  },
  plugins: ['import', '@babel', 'prettier'],
};
