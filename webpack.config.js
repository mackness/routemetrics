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
};
