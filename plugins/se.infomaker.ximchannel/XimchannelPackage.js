import ConceptChannelMainComponent from './ConceptChannelMainComponent'
import './scss/conceptchannel.scss'

export default {
    id: 'se.infomaker.ximchannel',
    name: 'ximchannel',
    version: '{{version}}',
    configure: function(config, pluginConfig) {
        config.addToSidebar('main', pluginConfig, ConceptChannelMainComponent)

        config.addLabel('Main channel', {
            sv: 'Huvudkanal'
        })

        config.addLabel('Remove from article', {
            sv: 'Ta bort från artikel'
        })

        config.addLabel('Search channels', {
            sv: 'Sök kanaler'
        })
    }
}
