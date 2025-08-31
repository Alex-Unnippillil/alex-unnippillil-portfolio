module.exports = {
  stories: ['../src/stories/**/*.stories.ts'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/html',
  core: {
    builder: 'webpack5',
  },
};
