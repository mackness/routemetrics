<<<<<<< HEAD
module.exports = {
  entry: "./public/js/main.js",
    output: {
      path: __dirname,
        filename: "./public/js/routemetrics.bundle.js"
      },
      module: {
      loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, './'),
      exclude: [
        path.join(__dirname, './node_modules/')
      ]
      },
    ] 
  },
=======
var path = require('path');
module.exports = {
    entry: './public/js/index.js',
    output: {
        path: __dirname,
        filename: './public/js/routemetrics.bundle.js'
    },
    module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: path.join(__dirname, './', 'public'),
            exclude: [
              path.join(__dirname, './node_modules/')
            ]
          }
        ]
    }
>>>>>>> 8703a58828ea2430961bd55a7133ec538414fe62
};
