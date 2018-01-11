import './scss/channelselector.scss'

import ChannelSelectorComponent from './ChannelSelectorComponent'

export default {
    id: 'se.infomaker.hdsds.channelselector',
    name: 'channelselector',
    version: '{{version}}',
    configure: function(config, pluginConfig) {
        config.addLabel('channelselector-Products', {
            en: 'Products',
            sv: 'Produkter'
        })

        config.addToSidebar('main', pluginConfig, ChannelSelectorComponent)
    }
}

