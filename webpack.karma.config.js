const webpack = require('webpack');

module.exports = {
  hot:false,
  output: {},
	entry: {},
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  plugins: []
};
