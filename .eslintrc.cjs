module.exports = {
  extends: [
    'airbnb-base',
    '@vue/airbnb',
    'plugin:vue/vue3-recommended',
    'plugin:sonarjs/recommended',
    'plugin:compat/recommended',
    'plugin:md/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.md'],
      parser: 'markdown-eslint-parser',
      rules: {
        'prettier/prettier': ['error', { parser: 'markdown' }],
      },
    },
  ],
  env: {
    browser: true,
    node: true,
  },
  // parser: 'vue-eslint-parser',
  // parserOptions: {
  //   parser: '@babel/eslint-parser',
  //   sourceType: 'module',
  // },
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'func-names': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 0,
    'prettier/prettier': ['error'],
    'md/remark': [
      'error',
      {
        plugins: [
          'preset-lint-markdown-style-guide',
          ['lint-emphasis-marker', '_'],
        ],
      },
    ],
  },
  plugins: ['import', '@babel', 'prettier', 'json-format'],
};
