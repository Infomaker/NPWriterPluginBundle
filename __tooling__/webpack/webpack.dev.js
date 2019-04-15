/*
|--------------------------------------------------------------------------
| Development config file
|--------------------------------------------------------------------------
|
| This is the webpack development config.
| Please leave it as it is.
|
| Or change it.
| I'm a comment, not a cop.
|
*/
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

console.info(` ----------------------------
   Plugin development build
 ----------------------------`)

module.exports = merge(common,
    {
        mode: 'development',
        resolve: {
            symlinks: false
        },
        performance: false,
        cache: true,
        devtool: 'cheap-module-eval-source-map',
        optimization: {
            namedModules: true,
            namedChunks: true
        },
        devServer: {
            disableHostCheck: true,
            contentBase: path.join(__dirname, 'dist'),
            historyApiFallback: true,
            compress: false,
            progress: true,
            port: 5001
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    }
)
