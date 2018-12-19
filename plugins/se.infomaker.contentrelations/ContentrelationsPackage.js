import ContentRelationsNode from './ContentRelationsNode'
import ContentRelationsConverter from './ContentRelationsConverter'
import ContentRelationsDropHandler from './ContentRelationsDropHandler'

import ContentRelationsComponent from './components/ContentRelationsComponent'
import ContentRelationsMainComponent from './components/ContentRelationsMainComponent'

import './scss/contentrelations.scss'
import './scss/searchresultitem.scss'

export default {
    name: 'contentrelations',
    id: 'se.infomaker.contentrelations',
    version: '{{version}}',
    configure: function(configurator, config) {

        configurator.addLabel('ContentRelations', {
            en: 'Related articles',
            sv: 'Relaterade artiklar'
        })
        configurator.addLabel('Enter query', {
            sv: 'Fritext'
        })
        configurator.addLabel('Search', {
            sv: 'Sök'
        })
        configurator.addLabel('Show', {
            sv: 'Visa'
        })
        configurator.addLabel('Sort', {
            sv: 'Sortera'
        })

        configurator.addNode(ContentRelationsNode)
        configurator.addConverter(ContentRelationsConverter)
        configurator.addComponent(this.name, ContentRelationsComponent)
        configurator.addDropHandler(new ContentRelationsDropHandler())
        configurator.addToSidebar(
            'ContentRelations',
            config,
            ContentRelationsMainComponent
        )
    }
}
