import ConceptChannelMainComponent from './ConceptChannelMainComponent'
import './scss/conceptchannel.scss'

export default {
    id: 'se.infomaker.ximchannel',
    name: 'ximchannel',
    version: '{{version}}',
    configure: function(config) {
        config.addComponentToSidebarWithTabId(
            this.id,
            'main',
            ConceptChannelMainComponent
        )

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
