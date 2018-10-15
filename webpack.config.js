const path = require('path');
const webpack = require('webpack');
// const $ = require("jquery");

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
     rules: [
      {
        test: /\.js?$/,
        include: path.join(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),
        use: [
          { loader: 'babel-loader' },
        ]
      },
       {
         test: /\.scss$/,
         use: [{
           loader: 'style-loader'
         }, {
           loader: 'css-loader'
         }, {
           loader: 'sass-loader'
         }]
       }
     ]
   },

   plugins: [
    new webpack.HotModuleReplacementPlugin(),
    ],


   devServer: {
    hot: true,
    open: true,
    publicPath: '/',
    inline: true,
    overlay: true,
    port: 9000,
    stats: {
      modules: false,
      colors: true,
      env: false,
      publicPath: true,
      timings: true,
      version: true,
      errors: true,
    },
  },
}
