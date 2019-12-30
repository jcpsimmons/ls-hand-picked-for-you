// Imports: Dependencies
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
require("babel-register"); // Babel conf

const config = {
  // Entry
  entry: "./src/generatorScript.js",
  // Output
  output: {
    path: path.resolve(__dirname, "./build")
    filename: "bundle.js"
  },
  // Loaders
  module: {
    rules: [
      // JavaScript/JSX Files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      // HTML files
      {
        test: /\.html$/,
        use: ["html-loader"]
      }
      // CSS Files
      //   {
      //     test: /\.css$/,
      //     use: ['style-loader', 'css-loader'],
      //   }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: ".(js|css)$", // embed all javascript and css inline
      template: "src/layout.html"
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
};
// Exports
module.exports = config;
