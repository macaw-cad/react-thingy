process.env.NODE_ENV = 'production';
process.env.PUBLIC_URL = '/app';
process.env.SERVER_BUNDLE_RELATIVE_OUTPUT_FOLDER = '../HypernovaComponentServer';

const webpack = require('webpack');
const config = require('webpack.server-bundle.config');

webpack(config(process.env)).run((err, stats) => {
  if (err) {
    console.error(err);
  } else {
    console.error(stats.toString({
      chunks: false,
      colors: true
    }));
    console.log(`Another successful ${process.env.NODE_ENV} server-bundle build to ${process.env.SERVER_BUNDLE_RELATIVE_OUTPUT_FOLDER}!`);
  }
});
