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
  {
    files: ['tests/**/*.{js,ts}'],
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
      'import-x/no-relative-parent-imports': 'off',
      // mikey-pro 10.3.9 enables strict jest style rules; tests run on Vitest
      // (expect(value, message) is valid there)
      'jest/max-expects': 'off',
      'jest/no-hooks': 'off',
      'jest/prefer-called-with': 'off',
      'jest/prefer-ending-with-an-expect': 'off',
      'jest/prefer-expect-assertions': 'off',
      'jest/prefer-lowercase-title': 'off',
      'jest/prefer-strict-equal': 'off',
      'jest/require-hook': 'off',
      'jest/require-top-level-describe': 'off',
      'jest/valid-expect': 'off',
      'max-lines-per-function': 'off',
    },
  },
];
