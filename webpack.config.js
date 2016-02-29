const webpack = require('webpack');

module.exports = {
  entry: './src/fetch-it.js',
  output: {
    path: './dist',
    filename: 'fetch-it.js',
    library: 'fetchIt',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ],
  devtool: 'source-map'
};
