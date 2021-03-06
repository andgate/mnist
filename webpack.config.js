const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => {
  return {
    target: ['web'],
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'docs'),
      filename: 'index.js',
      library: {
        type: 'umd'
      }
    },
    devServer: {
      static: {
        directory: path.join(__dirname),
      },
      compress: true,
      port: 9000
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.onnx', '.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    externals: {
      'onnxruntime-web': 'ort'
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
        {
          test: /\.onnx$/,
          loader: 'arraybuffer-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'assets', 'index.html'),
        inject: 'head',
        filename: path.resolve(__dirname, 'docs', 'index.html')
      })
    ]
  }
};