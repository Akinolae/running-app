var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
    "./main.jsx"
  ],

  output: {
    filename: "app.js",
    path: __dirname,
  },

  module: {
     loaders: [
        {
           test: /\.jsx?$/,
           exclude: /node_modules/,
           loaders: ['babel'],

          //  query: {
          //     presets: ['react','es2015']
          //  }
        }
     ]
  },
}
