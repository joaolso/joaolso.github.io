const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const glob = require('glob');
const globAll = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool:'source-map',
  entry:{
    main: path.join(__dirname, './_webpack', 'main.js'),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, './assets/css/')
  },
  module: {
    rules:[{
       test: /\.(scss)$/,
       exclude: /node_modules/,
       use: ExtractTextPlugin.extract({
         fallback: 'style-loader',
         use: ['css-loader','sass-loader']
       })
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'main.css'
    }),

    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {map: {inline:false, annotation:true}},
      cssProcessorPluginOptions: {
        preset: ['default', {discardComments: {removeAll: true}}]
      },
      canPrint:true
    }),

    new PurgecssPlugin({
      paths: globAll.sync([
        '*.html',
        './_layouts/*.html',
        './_includes/*.html',
        './pages/*.html'
      ]),
    })
  ]
}