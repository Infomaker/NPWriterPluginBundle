import ContentRelationsNode from './ContentRelationsNode'
import ContentRelationsComponent from './ContentRelationsComponent'
import ContentRelationsConverter from './ContentRelationsConverter'
import ContentRelationsMainComponent from './ContentRelationsMainComponent'
import ContentRelationsDropHandler from './ContentRelationsDropHandler'

export default {
    name: 'contentrelations',
    id: 'se.infomaker.contentrelations',
    version: '{{version}}',
    configure: function(configurator, config) {

        if (!config.tabid) {
            configurator.addSidebarTab(this.name, configurator.getLabelProvider().getLabel(this.name))
        }

        configurator.addComponentToSidebarWithTabId(
            this.name,
            config.tabid || this.name,
            ContentRelationsMainComponent,
            config
        )

        configurator.addNode(ContentRelationsNode)
        configurator.addConverter('newsml', ContentRelationsConverter)
        configurator.addComponent(this.name, ContentRelationsComponent)
        configurator.addDropHandler(new ContentRelationsDropHandler())

        configurator.addLabel('ContentRelations', {
            en: 'Related content',
            sv: 'Relaterat innehåll'
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
    }
}
