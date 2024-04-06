import path from 'node:path';

import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';

const SRC_DIR = path.join(path.resolve(), '/src/index.ts');
const DIST_DIR = path.join(path.resolve(), '/public/dist');

const scss = ['vue-style-loader', 'css-loader', 'sass-loader'];

const weback = {
  mode: 'development',
  entry: SRC_DIR,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  devServer: {
    contentBase: './public/dist',
    hot: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      node: 'current',
                    },
                    modules: false,
                  },
                ],
              ],
              plugins: [['@vue/babel-plugin-jsx']],
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: scss,
      },
      {
        test: /\.(png|ttf|jp(e*)g)$/,
        use: 'url-loader?limit=100000&name=img/[name].[ext]',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader?limit=100000&name=img/[name].[ext]'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.vue', '.json', '...'],
  },
  experiments: {
    topLevelAwait: true,
  },
  devtool: 'source-map',
};

export default weback;
