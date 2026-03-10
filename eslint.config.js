import vue from '@mikey-pro/eslint-config-vue';
import config from 'mikey-pro';

export default [
  ...config,
  ...vue,
  {
    files: [
      'eslint.config.js',
      'webpack.config.js',
      '**/*.config.{js,ts,mjs,cjs}',
    ],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
];
