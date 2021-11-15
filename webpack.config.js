const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    target: ['web'],
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: {
        type: 'umd'
      }
    },
    devServer: {
      static: {
        directory: path.join(__dirname, './dist'),
      },
      compress: true,
      port: 9000
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css']
    },
    module: {
      rules: [
        {
          test: /\.(js)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            babelrc: true,
          },
        },
        {
          test: /\.(ts)x?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            babelrc: true,
          },
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader']
        },
      ]
    },
    plugins: [
      new CopyPlugin({
        // Use copy plugin to copy *.wasm to output folder.
        patterns: [{ from: 'node_modules/onnxruntime-web/dist/*.wasm', to: '[name][ext]' }]
      }),
      new HtmlWebpackPlugin({
        title: 'Handwriting Recognizer',
        filename: path.resolve(__dirname, 'dist', 'index.html') //relative to root of the application
      })
    ]
  }
};