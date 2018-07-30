/*
 |--------------------------------------------------------------------------
 | Production config file
 |--------------------------------------------------------------------------
 |
 | This is the webpack production config.
 | Please leave it as it is.
 |
 | Or change it.
 | I'm a comment, not a cop.
 |
 */
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

console.info(` ----------------------------
   Plugin production build
 ----------------------------`)

module.exports = merge(common,
    {
        mode: 'production',
        devtool: 'source-map',
        optimization: {
            occurrenceOrder: true,
            noEmitOnErrors: true,
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: { zindex: false }
                })
            ]
        },
    }
)
