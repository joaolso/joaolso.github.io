const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ImageminPlugin = require ('imagemin-webpack-plugin').default;

const glob = require('glob');
const globAll = require('glob-all');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = {
  entry:{
    main: path.join(__dirname, './_webpack', 'main.js'),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, './assets/css/')
  },
  mode: "production",
  module: {
    rules:[{
      test: /\.jsx?$/,
      exclude: /(node_modules)/,
      loader: "babel-loader",
      query: {
        presets: ["@babel/preset-env"]
      }
    },
    {
      test: /\.(scss)$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader','sass-loader']
      })
   },
   {
    test: /\.(png|gif|jpe?g|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          emitFile: true,
          useRelativePath: true,
          name: "[name].[ext]",
        }
      },
    ]
  }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'main.css'
    }),

    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      // cssProcessorOptions: {map: {inline:false, annotation:true}},
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
    }),
    new ImageminPlugin({
      externalImages: {
        context: './', // Important! This tells the plugin where to "base" the paths at
        sources: glob.sync('./_webpack/images/*'),
        destination: './assets/images',
        fileName: '[name].[ext]' // (filePath) => filePath.replace('jpg', 'webp') is also possible
      }
    })
  ]
}
