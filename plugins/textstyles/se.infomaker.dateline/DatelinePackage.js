import DatelineComponent from './DatelineComponent'
import DatelineConverter from './DatelineConverter'
import DatelineNode from './DatelineNode'

export default {
    name: 'dateline',
    id: 'se.infomaker.dateline',
    version: '{{version}}',
    configure: function (config) {

        DatelineNode.type = this.name
        DatelineConverter.type = DatelineNode.type
        DatelineConverter.element = DatelineNode.type

        config.addNode(DatelineNode)
        config.addComponent(DatelineNode.type, DatelineComponent)

        config.addConverter('newsml', DatelineConverter)

        config.addTextType({
            name: this.name,
            data: {type: DatelineNode.type}
        })
        config.addLabel('dateline', {
            en: 'Dateline',
            sv: 'Ortdatering'
        })
        config.addLabel('dateline.content', {
            en: 'Dateline',
            sv: 'Ortdatering'
        })
    }
}