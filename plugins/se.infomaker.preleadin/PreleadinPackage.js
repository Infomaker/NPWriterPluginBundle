import PreleadinComponent from './PreleadinComponent'
import PreleadinConverter from './PreleadinConverter'
import PreleadinNode from './PreleadinNode'

export default {
    name: 'preleadin',
    id: 'se.infomaker.preleadin',
    configure: function (config) {

        PreleadinNode.type = this.name
        PreleadinConverter.type = PreleadinNode.type
        PreleadinConverter.element = PreleadinNode.type

        config.addNode(PreleadinNode)
        config.addComponent(PreleadinNode.type, PreleadinComponent)

        config.addConverter('newsml', PreleadinConverter)

        config.addTextType({
            name: this.name,
            data: {type: PreleadinNode.type}
        })
        config.addLabel('preleadin', {
            en: 'Preleadin',
            sv: 'Överingress'
        })
        config.addLabel('preleadin.content', {
            en: 'Preleadin',
            sv: 'Överingress'
        })
    }
}