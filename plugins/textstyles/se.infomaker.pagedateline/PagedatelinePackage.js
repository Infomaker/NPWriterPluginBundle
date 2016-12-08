import PagedatelineComponent from './PagedatelineComponent'
import PagedatelineConverter from './PagedatelineConverter'
import PagedatelineNode from './PagedatelineNode'

export default {
    name: 'pagedateline',
    id: 'se.infomaker.pagedateline',
    configure: function (config) {

        PagedatelineNode.type = this.name
        PagedatelineConverter.type = PagedatelineNode.type
        PagedatelineConverter.element = PagedatelineNode.type

        config.addNode(PagedatelineNode)
        config.addComponent(PagedatelineNode.type, PagedatelineComponent)

        config.addConverter('newsml', PagedatelineConverter)

        config.addTextType({
            name: this.name,
            data: {type: PagedatelineNode.type}
        })
        config.addLabel('pagedateline', {
            en: 'Pagedateline',
            sv: 'Vinjett'
        })
        config.addLabel('pagedateline.content', {
            en: 'Pagedateline',
            sv: 'Vinjett'
        })
    }
}