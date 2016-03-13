const webpackConf = require('./webpack.karma.config.js');

module.exports = function (config) {
  config.set({
    files: [
      // Each file acts as entry point for the webpack configuration
      './node_modules/babel-polyfill/dist/polyfill.js',
      './test/**/*.spec.js'
    ],
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai', 'es6-shim'],
    preprocessors: {
      './test/**/*.spec.js': ['webpack']
    },
    webpack: {
      module: webpackConf.module
    },
    webpackMiddleware: {
      noInfo: true
    },
    browsers: ['PhantomJS'],
    reporters: ['spec']
  });
};
