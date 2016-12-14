import MadmansrowComponent from './MadmansrowComponent'
import MadmansrowConverter from './MadmansrowConverter'
import MadmansrowNode from './MadmansrowNode'

export default {
    name: 'madmansrow',
    id: 'se.infomaker.madmansrow',
    configure: function (config) {

        MadmansrowNode.type = this.name
        MadmansrowConverter.type = MadmansrowNode.type
        MadmansrowConverter.element = MadmansrowNode.type

        config.addNode(MadmansrowNode)
        config.addComponent(MadmansrowNode.type, MadmansrowComponent)

        config.addConverter('newsml', MadmansrowConverter)

        config.addTextType({
            name: this.name,
            data: {type: MadmansrowNode.type}
        })
        config.addLabel('madmansrow', {
            en: 'Madmansrow',
            sv: 'Dårrad'
        })
        config.addLabel('madmansrow.content', {
            en: 'Madmansrow',
            sv: 'Dårrad'
        })
    }
}