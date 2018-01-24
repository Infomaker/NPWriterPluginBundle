/*
|--------------------------------------------------------------------------
| Development config file
|--------------------------------------------------------------------------
|
| This is you webpack development config.
| Please leave it as it is.
|
*/

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const fs = require('fs')
console.log("\n ----------------------------")
console.log(" Plugin development build ")
console.log(" ----------------------------\n")

function getPluginBuildSpec(dir) {
    const result = {}
    const list = fs.readdirSync(dir);

    // For every file in the list
    list.forEach(function (file) {
        const basename = file.substr(0, file.length - 3);
        result[basename] = dir + '/' + basename;
    });

    return result
}
const version = process.env.VERSION || 'dev'

module.exports = {
    entry: getPluginBuildSpec('./plugins/plugin-build-spec'),
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
        port: 5001
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
                    'babel?presets[]=stage-0,presets[]=es2015-node6'
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
