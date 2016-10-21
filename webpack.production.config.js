/*
 |--------------------------------------------------------------------------
 | Production config file
 |--------------------------------------------------------------------------
 |
 | This is you webpack production config.
 | Please leave it as it is.
 |
 */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

console.log("\n ----------------------------")
console.log(" Plugin production build ")
console.log(" ----------------------------\n")

module.exports = {
    entry: "./plugins/index.js",
    output: {
        filename: "index.js",
        path: "dist",
    },
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
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
            {test: /\.js?$/, loader: 'eslint', exclude: /node_modules/}

        ]
    },
    cssLoader: {
        // True enables local scoped css
        modules: false,
        // Which loaders should be applied to @imported resources (How many after the css loader)
        importLoaders: 1,
        sourceMap: false
    },
    eslint: {
        failOnWarning: false,
        failOnError: true
    },
    plugins: [
        new ExtractTextPlugin("style.css"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: false,
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        })
    ]
};
