const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'final.js',
  },
  target: 'node',
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify')
    }
  },
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
};
