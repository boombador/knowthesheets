
var path = require('path');

module.exports = {
  entry: "./app.js",
  loaders: [
      {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
              presets: ['es2015']
          }
      }
  ],
  output: {
      path: path.resolve(__dirname, "build"),
      publicPath: "/assets/",
      filename: "bundle.js"
  }
}
