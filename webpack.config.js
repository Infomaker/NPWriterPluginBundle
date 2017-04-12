/*
 |--------------------------------------------------------------------------
 | Development config file
 |--------------------------------------------------------------------------
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PluginBundler = require('./utils/PluginBundler')

console.log("\n ----------------------------")
console.log(" Plugin development build ")
console.log(" ----------------------------\n")

const version = process.env.VERSION || 'dev'

module.exports = {
    entry: PluginBundler.getPluginBuildSpec(),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    externals: {
        "substance": "substance",
        "writer": "writer"
    },

    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        inline: true,
        compress: false,
        port: 5001,
        host: '0.0.0.0'
    },
    module: {
        loaders: [
          {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
          },
          {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract('style', 'css!sass')
          },
          {
              test: /\.js?$/,
              exclude: /(node_modules)/,
              loaders: [
                  'babel?presets[]=stage-0,presets[]=es2015'
              ]
          }
        ],
        preLoaders: [
            { test: /\.js?$/, loader: 'eslint', exclude: /node_modules/ },
            {
                test: /\.js$/,
                loader: 'string-replace',
                query: {
                    multiple: [
                        {
                            search: '{{version}}',
                            replace: version,
                            flags: 'g'
                        }
                    ]
                },
                flags: 'g'
            }
        ]
    },
    cssLoader: {
        // True enables local scoped css
        modules: false,
        // Which loaders should be applied to @imported resources (How many after the css loader)
        importLoaders: 1,
        sourceMap: true
    },
    eslint: {
        failOnWarning: false,
        failOnError: true
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        })
    ]
};
