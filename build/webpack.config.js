var path = require('path'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  // new webpack.HotModuleReplacementPlugin(),

  // If we need more chunks: https://github.com/webpack/extract-text-webpack-plugin#api
  // new ExtractTextPlugin('styles.css', {
  //     allChunks: true,
  // }),
];

module.exports = {
  entry: {
    // Recipe: './app/views/recipe.js',
    main: [
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:8080',
      './app/main.js',
    ],
  },
  output: {
    path: './app/bin/',
    // publicPath: '/app/',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      { test: /\.scss$/, loader: 'style-loader!css-loader?modules!sass-loader' }, // use ! to chain loaders
      // { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader')}, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader?modules' },
    ],
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    // extensions: ['', '.js', '.json', '.coffee']
  },
  plugins: plugins,
};