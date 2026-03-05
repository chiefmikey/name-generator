import config from 'mikey-pro';

export default [
  ...config,
  {
    files: [
      'eslint.config.js',
      'webpack.config.ts',
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
    files: ['src/routes/**/*.ts', 'server.ts'],
    rules: {
      'no-console': 'warn',
      'require-atomic-updates': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
  {
    files: ['src/routes/db/**/*.ts', 'src/routes/external/animal.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'import-x/extensions': 'off',
      'import-x/no-unresolved': 'off',
    },
  },
];
