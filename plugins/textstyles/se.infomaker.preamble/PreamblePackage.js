import PreambleComponent from './PreambleComponent'
import PreambleConverter from './PreambleConverter'
import PreambleNode from './PreambleNode'

export default {
    name: 'preamble',
    id: 'se.infomaker.preamble',
    configure: function (config) {

        PreambleNode.type = this.name
        PreambleConverter.type = PreambleNode.type
        PreambleConverter.element = PreambleNode.type


        config.addNode(PreambleNode)
        config.addComponent(PreambleNode.type, PreambleComponent)

        config.addConverter('newsml', PreambleConverter)

        config.addTextType({
            name: this.name,
            data: {type: PreambleNode.type}
        })
        config.addLabel('preamble', {
            nl: 'Inleiding',
            en: 'Preamble',
            sv: 'Ingress'
        })
        config.addLabel('preamble.content', {
            nl: 'Inleiding',
            en: 'Preamble',
            sv: 'Ingress'
        })
    }
}