
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
};
