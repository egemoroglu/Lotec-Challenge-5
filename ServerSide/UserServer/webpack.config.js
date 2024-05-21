const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './server.ts',
  target: 'node',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'build'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '.env'), // Path to .env file
    }),
  ],
};