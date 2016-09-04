
var path = require('path');

module.exports = {
  entry: "./app.js",
  output: {
      path: path.resolve(__dirname, "build"),
      publicPath: "/assets/",
      filename: "bundle.js"
  },
  watch: true
}
