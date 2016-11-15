import ContentRelationsNode from './ContentRelationsNode'
import ContentRelationsComponent from './ContentRelationsComponent'
import ContentRelationsConverter from './ContentRelationsConverter'
import ContentRelationsMainComponent from './ContentRelationsMainComponent'
import ContentRelationsDropHandler from './ContentRelationsDropHandler'

export default {
    name: 'contentrelations',
    id: 'se.infomaker.contentrelations',
    configure: function(config) {

        config.addSidebarTab('contentrelations', 'Related Content')
        config.addComponentToSidebarWithTabId('contentrelations', 'contentrelations', ContentRelationsMainComponent)
        config.addDragAndDrop(ContentRelationsDropHandler)
        config.addComponent('contentrelations', ContentRelationsComponent)
        config.addNode(ContentRelationsNode)
        config.addConverter('newsml', ContentRelationsConverter)
    }
}
