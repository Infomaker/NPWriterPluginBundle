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
const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')

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
            compress: true,
            progress: true,
            inline: false,
            port: 5001
        },
        plugins: []
    }
)
