const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
      auth: './js/auth.js',
    },
    output: {
      filename: 'js.js',
      path: __dirname + '/dist',
    },
};