import DropheadComponent from './DropheadComponent'
import DropheadConverter from './DropheadConverter'
import DropheadNode from './DropheadNode'

export default {
    name: 'drophead',
    id: 'se.infomaker.drophead',
    version: '{{version}}',
    configure: function (config) {

        DropheadNode.type = this.name
        DropheadConverter.type = DropheadNode.type
        DropheadConverter.element = DropheadNode.type

        config.addNode(DropheadNode)
        config.addComponent(DropheadNode.type, DropheadComponent)

        config.addConverter('newsml', DropheadConverter)

        config.addTextType({
            name: this.name,
            data: {type: DropheadNode.type}
        })

        config.addLabel('drophead', {
            en: 'Drophead',
            sv: 'Nedryckare'
        })

        config.addLabel('drophead.content', {
            en: 'Drophead',
            sv: 'Nedryckare'
        })

        config.addLabel('drophead.short', {
            en: 'DH',
            sv: 'NED'
        })
    }
}
