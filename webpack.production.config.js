const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const plugins = [
  new ExtractTextPlugin('style.[hash].min.css', {
    allChunks: true
  }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new HtmlWebpackPlugin({
    template: './index.tpl.html'
  }),
  new CopyWebpackPlugin([
    { from: 'content', to: 'content' },
  ]),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  }),
  new WebpackShellPlugin({
    onBuildEnd: ['node scripts/moveHtml.js']
  }),
];

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.[hash].min.js',
    publicPath: './'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'src'),
        loader: ExtractTextPlugin.extract('css!postcss-loader!sass')
      },
      {
        test: /\.json?$/,
        include: path.join(__dirname, 'src'),
        loader: 'json-loader'
      },
    ]
  },
  plugins: plugins,
  postcss: [
    require('autoprefixer')({ browsers: ['last 4 versions'] })
  ]
};