import FactbodyComponent from './FactbodyComponent'
import FactbodyConverter from './FactbodyConverter'
import FactbodyNode from './FactbodyNode'

export default {
    name: 'factbody',
    id: 'se.infomaker.factbody',
    version: '{{version}}',
    configure: function (config) {

        FactbodyNode.type = this.name
        FactbodyConverter.type = this.name
        FactbodyConverter.element = this.name


        config.addNode(FactbodyNode)
        config.addComponent(FactbodyNode.type, FactbodyComponent)

        config.addConverter('newsml', FactbodyConverter)

        config.addTextType({
            name: this.name,
            data: {type: FactbodyNode.type}
        })

        config.addLabel('factbody', {
            en: 'Factbody',
            sv: 'Infotext'
        })

        config.addLabel('factbody.content', {
            en: 'Factbody',
            sv: 'Infotext'
        })

        config.addLabel('factbody.short', {
            en: 'FCT',
            sv: 'IT'
        })
    }
}
