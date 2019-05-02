var path = require('path');

module.exports = async ({ config, mode }) => {
  config.node = {
    fs: 'empty',
    tls: 'empty',
    net: 'empty'
  }

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [
      path.resolve(__dirname, '.'),
      path.resolve(__dirname, '../src'),
    ],
    loader: require.resolve('awesome-typescript-loader'),
    options: {
      configFileName: 'tsconfig.storybook.json'
    }
  });

  config.resolve.extensions.push('.ts', '.tsx');
  
  return config;
};