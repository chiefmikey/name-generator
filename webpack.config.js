import path from 'path';
import { VueLoaderPlugin } from 'vue-loader';

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'));

const SRC_DIR = path.join(__dirname, '/client/src');
const DIST_DIR = path.join(__dirname, '/client/public/dist');

const vue = 'vue-style-loader';
const css = 'css-loader';

export default {
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
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['*', '.js', '.jsx', '.vue', '.json', '...'],
  },
};
