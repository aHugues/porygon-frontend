const fs = require('fs');
const webpack = require('webpack');

const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

const manifestJson = require('./public/manifest.json');

const pwaArgs = {
  themeColor: manifestJson.theme_color,
  name: manifestJson.short_name,
  msTileColor: manifestJson.background_color,
};

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: `"${version}"`,
        },
      }),
    ],
  },
  chainWebpack: (config) => {
    config.plugin('pwa').tap(() => [pwaArgs]);
  },
// the rest of your original module.exports code goes here
};
