module.exports = {
  settings: {
    'vetur.useWorkspaceDependencies': true,
    'vetur.experimental.templateInterpolationService': true,
  },
  projects: [
    {
      root: './',
      package: './package.json',
      globalComponents: ['./client/src/components/**/*.vue'],
      tsconfig: './client/jsconfig.json',
    },
  ],
};
