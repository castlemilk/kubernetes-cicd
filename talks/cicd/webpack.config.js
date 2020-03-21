/* eslint-disable */

var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    '@babel/polyfill',
    'webpack-hot-middleware/client',
    'react-hot-loader/patch',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
      test: /\.md$/,
      use: [ {
        loader: 'raw-loader',

        options: {
          gfm: false
        }
      }]
    },
     {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }],
      include: __dirname
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'raw-loader'
      }],
      include: __dirname
    }, {
      test: /\.svg$/,
      use: [{
        loader: 'url-loader',

        options: {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      }],
      include: path.join(__dirname, 'assets')
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "01_intro", "components", "Architecture", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "01_intro", "components", "Topology", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "02_environment_setup", "components", "Architecture", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "02_environment_setup", "components", "Topology", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "03_kubernetes_concepts", "components", "Resources", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "05_istio_concepts", "components", "Architecture", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "05_istio_concepts", "components", "APILifeCycle", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "05_istio_concepts", "components", "IngressFlowBasic", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "05_istio_concepts", "components", "Security", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "05_istio_concepts", "components", "Tracing", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "05_istio_concepts", "components", "EgressFlowBasic", "images")
    },
    {
      test: /\.svg$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml",
      include: path.join(__dirname, "presentation", "slides", "05_istio_concepts", "components", "EgressFlowAdvanced", "images")
    },
    {
      test: /\.png$/,
      use: [{
        loader: 'url-loader',

        options: {
          mimetype: 'image/png'
        }
      }],
      include: path.join(__dirname, 'assets')
    }, {
      test: /\.gif$/,
      use: [{
        loader: 'url-loader',

        options: {
          mimetype: 'image/gif'
        }
      }],
      include: path.join(__dirname, 'assets')
    }, {
      test: /\.jpg$/,
      use: [{
        loader: 'url-loader',

        options: {
          mimetype: 'image/jpg'
        }
      }],
      include: path.join(__dirname, 'assets')
    }]
  }
};
