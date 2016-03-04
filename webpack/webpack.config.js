// var path = require('path');
var webpack = require('webpack');
//   ExtractTextPlugin = require('extract-text-webpack-plugin');

var plugins = [
  // new webpack.HotModuleReplacementPlugin(),

  // If we need more chunks: https://github.com/webpack/extract-text-webpack-plugin#api
  // new ExtractTextPlugin('styles.css', {
  //     allChunks: true,
  // }),
  new webpack.ProvidePlugin({
    'fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch',
  }),
];

module.exports = {
  entry: {
    main: [
      // 'webpack/hot/dev-server',
      // 'webpack-dev-server/client?http://localhost:8080',
      './app/main.js',
    ],
    // test: [
    //   './app/test.js',
    // ],
  },
  output: {
    path: './app/build/',
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
      // { test: /\.svg(\?.*)?$/, loader: 'file-loader?name=[name].[ext]' },
    ],
  },
  resolve: {
    // you can now require('file') instead of require('file.coffee')
    extensions: ['', '.js', '.json'],
  },
  resolveLoader: {
    // root: [path.resolve('./build')]
  },
  plugins: plugins,
};
