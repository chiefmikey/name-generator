import config from 'mikey-pro';

export default [
  ...config,
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
