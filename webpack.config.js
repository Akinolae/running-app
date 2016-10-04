module.exports = {
  context: __dirname + "/client/jsx",
  entry: "./app.jsx",

  output: {
    filename: "app.js",
    path: __dirname + "/client/dist",
  },

  module: {
     loaders: [
        {
           test: /\.jsx?$/,
           exclude: /node_modules/,
           loader: 'babel',

           query: {
              presets: ['react','es2015']
           }
        }
     ]
  },
}
