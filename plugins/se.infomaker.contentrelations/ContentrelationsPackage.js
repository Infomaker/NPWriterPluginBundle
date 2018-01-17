import ContentRelationsNode from './ContentRelationsNode'
import ContentRelationsComponent from './ContentRelationsComponent'
import ContentRelationsConverter from './ContentRelationsConverter'
import ContentRelationsMainComponent from './ContentRelationsMainComponent'
import ContentRelationsDropHandler from './ContentRelationsDropHandler'

export default {
    name: 'contentrelations',
    id: 'se.infomaker.contentrelations',
    version: '{{version}}',
    configure: function(config, pluginConfig) {

        config.addLabel('ContentRelations', {
            en: 'Related content',
            sv: 'Relaterat innehåll'
        })

        config.addToSidebar('ContentRelations', pluginConfig, ContentRelationsMainComponent)
        config.addDropHandler(new ContentRelationsDropHandler())
        config.addComponent('contentrelations', ContentRelationsComponent)
        config.addNode(ContentRelationsNode)
        config.addConverter('newsml', ContentRelationsConverter)

        config.addLabel('Enter query', {
            sv: 'Sökfråga'
        })

        config.addLabel('Search', {
            sv: 'Sök'
        })
    }
}
