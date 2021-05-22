/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import path, { dirname } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const devServer = (isDev) => (!isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    contentBase: path.join(__dirname, 'public'), // ['./src', './public']
  },
});

const esLintPlugin = (isDev) => (isDev ? [] : [new ESLintPlugin({ extensions: ['ts', 'js'] })]);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const config = ({ development }) => ({
  mode: development ? 'development' : 'production',
  devtool: development ? 'inline-source-map' : false,
  entry: {
    main: './src/index.ts',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[hash][ext]',
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    ...esLintPlugin(development),
    new MiniCssExtractPlugin({ filename: '[name].css' }), // [contenthash]. // из-за этого!!!
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public' },
      ],
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
  ],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  ...devServer(development),
  target: 'web', // ??
});

export default config;
