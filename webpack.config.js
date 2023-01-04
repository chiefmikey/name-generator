import path from 'node:path';

import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'));

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/public/dist');

const vue = 'vue-style-loader';
const css = 'css-loader';

const weback = {
  mode: 'development',
  entry: `${SRC_DIR}/index.js`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js?/,
        exclude: /node_modules/,
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
      {
        test: /\.css$/,
        use: [vue, css],
      },
      {
        test: /\.scss$/,
        use: [vue, css, 'sass-loader'],
      },
      {
        test: /\.sass$/,
        use: [vue, css, 'sass-loader'],
      },
      {
        test: /\.styl(us)?$/,
        use: [vue, css, 'stylus-loader'],
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
    extensions: ['*', '.js', '.jsx', '.vue', '.json', '...'],
  },
};

export default weback;
