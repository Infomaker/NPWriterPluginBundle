import './scss/channelselector.scss'

import ChannelSelectorComponent from './ChannelSelectorComponent'

export default {
    id: 'se.infomaker.hdsds.channelselector',
    name: 'channelselector',

    configure: function(config) {
        config.addComponentToSidebarWithTabId('channelselector', 'mail', ChannelSelectorComponent)
    }
}

