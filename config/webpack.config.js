'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      // popup: PATHS.src + '/popup.ts',
      // contentScript: PATHS.src + '/contentScript.ts',
      background: PATHS.src + '/background.ts',
      // bundle: PATHS.src + '/bundle.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "util": require.resolve("util/"),
        "zlib": require.resolve("browserify-zlib"),
        "assert": require.resolve("assert/"),
        "node-libofx": false,
        "constants": require.resolve("constants-browserify"),
        "buffer": require.resolve("buffer"),
        fs: false,
      },
    }
  });

module.exports = config;
