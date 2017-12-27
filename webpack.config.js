/*eslint-disable no-var, one-var, func-names, indent, prefer-arrow-callback, object-shorthand, no-console, newline-per-chained-call, one-var-declaration-per-line, prefer-template, vars-on-top */
var path            = require('path'),
    autoprefixer    = require('autoprefixer'),
    webpack         = require('webpack'),
    CleanPlugin     = require('clean-webpack-plugin'),
    ExtractText     = require('extract-text-webpack-plugin'),
    HtmlPlugin      = require('html-webpack-plugin'),
    ScriptExtPlugin = require('script-ext-html-webpack-plugin'),
    CopyPlugin      = require('copy-webpack-plugin');

var build = process.env.NODE_ENV === 'production';
var cssLoaders = 'css!postcss?pack=custom!sass';
var config = {
  context: path.join(__dirname, 'app'),
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, './.modernizrrc')
    },
    modules: ['node_modules', path.join(__dirname, 'app/scripts')],
    modulesDirectories: ['node_modules', path.join(__dirname, 'app/scripts')], // deprecated
    extensions: ['', '.js', '.jsx']
  },
  entry: {
    '/scripts/app': './scripts/main.js',
    '/scripts/vendor/modernizr': './scripts/vendor/modernizr-custom.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: build ? ExtractText.extract(cssLoaders) : 'style!' + cssLoaders
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&minetype=application/font-woff' + (build ? '&name=/fonts/[name].[ext]' : ''),
        include: /fonts/
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file' + (build ? '?name=/fonts/[name].[ext]' : ''),
        include: /fonts/
      },
      {
        test: /media\/.*\.(jpe?g|png|gif|swf)$/i,
        loaders: [
          'file?hash=sha512&digest=hex' + (build ? '&name=/media/[name].[ext]' : ''),
          'image-webpack?bypassOnDebug=false&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test: /\.(swf|svg)$/,
        loaders: [
          'file' + (build ? '?name=/media/[name].[ext]' : '')
        ]
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.modernizrrc$/,
        loader: 'modernizr'
      }
    ]
  },
  postcss: function() {
    return {
      defaults: [autoprefixer],
      custom: [
        autoprefixer({
          browsers: [
            'ie >= 9',
            'ie_mob >= 10',
            'ff >= 30',
            'chrome >= 34',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4.4',
            'bb >= 10'
          ]
        })
      ]
    };
  },
  sassLoader: {
    includePaths: [path.join(__dirname, 'node_modules')],
    sourceMap: true,
    sourceMapContents: true
  },
  cssLoader: {
    minification: build,
    sourceMap: true
  }
};

if (build) {
  config.plugins = config.plugins.concat([
    new CleanPlugin(['dist'], { verbose: false }),
    new CopyPlugin([
      { from: './robots.txt' },
      { from: './.htaccess' }
    ]),
    new ExtractText('/styles/app.[hash].css'),
    new HtmlPlugin({
      appMountId: 'react',
      favicon: './favicon.ico',
      googleAnalytics: {
        trackingId: 'UA-58949521-1',
        pageViewOnLoad: true
      },
      inject: false,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      mobile: true,
      template: './index.ejs',
      title: 'ColorMeUp'
    }),
    new ScriptExtPlugin({
      async: [/app/]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]);
}

module.exports = config;