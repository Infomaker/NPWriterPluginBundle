const fs = require('fs')

const PluginBundler = {}

/**
* Iterates over every plugin file in plugins/ and plugins/textstyles
* and adds to an object later processed by webpack
*
* @returns {{}}
*/
PluginBundler.getPluginBuildSpec = function() {
    const dirs = [
        './plugins',
        './plugins/textstyles'
    ]
    const pluginList = {}

    dirs.forEach(function(dir) {
        this.getPluginPaths(dir, pluginList)
    }.bind(this))

    return pluginList
}

/**
* Iterates over every plugin file in dir and adds to
* an object later processed by webpack
*
* @param {string} dir
* @param {object} pluginList
*
* @returns {object}
*/
PluginBundler.getPluginPaths = function(dir, pluginList) {
    const list = fs.readdirSync(dir);

    list.forEach(function (entry) {
        if (entry.substr(0, 1) === '.') {
            return
        }

        // Filter away textstyles
        if (entry === 'textstyles') {
            return
        }

        pluginList[entry] = dir + '/' + entry + '/index';
    });
}

module.exports = PluginBundler
