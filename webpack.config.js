var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: [
    "./client/clientApp.jsx"
  ],

  output: {
    path: "./client/",
    filename: "clientApp.js",
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
