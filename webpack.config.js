import path from 'node:path';

import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';

const SRC_DIR = path.join(path.resolve(), '/src/index.ts');
const DIST_DIR = path.join(path.resolve(), '/public/dist');

const scss = [
  'vue-style-loader',
  'css-loader',
  { loader: 'sass-loader', options: { api: 'modern-compiler' } },
];

const webpackConfig = {
  devServer: {
    contentBase: './public/dist',
    hot: true,
    open: true,
  },
  devtool: 'source-map',
  entry: SRC_DIR,
  experiments: {
    topLevelAwait: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        loader: 'vue-loader',
        test: /\.vue$/u,
      },
      {
        exclude: /node_modules/u,
        test: /\.(js|jsx|ts|tsx)$/u,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [['@vue/babel-plugin-jsx']],
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    targets: {
                      node: 'current',
                    },
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/u,
        use: scss,
      },
      {
        test: /\.(png|ttf|jp(e*)g)$/u,
        use: 'url-loader?limit=100000&name=img/[name].[ext]',
      },
      {
        test: /\.svg$/u,
        use: ['@svgr/webpack', 'url-loader?limit=100000&name=img/[name].[ext]'],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: DIST_DIR,
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
};

export default webpackConfig;
