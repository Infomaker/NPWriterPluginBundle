/*
|--------------------------------------------------------------------------
| Webpack config file
|--------------------------------------------------------------------------
|
| This is the common webpack config.
| Please leave it as it is.
|
| Or change it.
| I'm a comment, not a cop.
*/
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require('fs')

function getPluginBuildSpec(dir) {
    const list = fs.readdirSync(dir)

    return list.reduce((res, file) => {
        const basename = file.substr(0, file.length - 3)
        res[basename] = `${dir}/${basename}`
        return res
    }, {})
}

const version = process.env.VERSION || 'dev'

module.exports = {
    entry: getPluginBuildSpec('./plugins/plugin-build-spec'),
    output: {
        path: path.join(__dirname, '..', '..', 'dist'),
        filename: '[name].js'
    },
    externals: {
        substance: 'substance',
        writer: 'writer'
    },
    stats: 'minimal',
    module: {
        rules: [
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'string-replace-loader',
                options: {
                    search: '{{version}}',
                    replace: version,
                    flags: 'g'
                }
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    failOnWarning: false,
                    failOnError: false,
                    quiet: true
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            }
        ]
    },
    optimization: {
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        removeAvailableModules: true
    },
    plugins: [
        new MiniCssExtractPlugin('[name].css')
    ]
}
