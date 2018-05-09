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

console.info(` ----------------------------
   Plugin production build 
 ----------------------------`)

module.exports = merge(common,
    {
        mode: 'production',
        devtool: 'source-map'
    }
)
