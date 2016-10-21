import PreambleComponent from './PreambleComponent'
import PreambleConverter from './PreambleConverter'
import PreambleNode from './PreambleNode'

export default {
    name: 'preamble',
    id: 'se.infomaker.preamble',
    configure: function (config) {

        config.addNode(PreambleNode)
        config.addComponent(PreambleNode.type, PreambleComponent)
        config.addConverter('newsml', PreambleConverter)

        config.addTextType({
            name: 'preamble',
            data: {type: 'preamble'}
        })
        config.addLabel('preamble.content', {
            en: 'Preamble',
            sv: 'Ingress'
        })
    }
}