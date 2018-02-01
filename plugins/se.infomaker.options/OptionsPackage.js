// import './scss/options.scss'

import OptionsComponent from './OptionsComponent'

export default {
    name: 'options',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addToSidebar('main', pluginConfig, OptionsComponent)
    }
}
