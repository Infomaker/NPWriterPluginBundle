import {platform} from 'substance'
import PreambleComponent from './PreambleComponent'
import PreambleConverter from './PreambleConverter'
import PreambleNode from './PreambleNode'
import TextstyleCommand from '../TextstyleCommand'

export default {
    name: 'preamble',
    id: 'se.infomaker.preamble',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        PreambleNode.type = this.name
        PreambleConverter.type = PreambleNode.type
        PreambleConverter.element = PreambleNode.type
        config.addCommand('switch-to-preamble', TextstyleCommand, {textType: PreambleNode.type})


        config.addNode(PreambleNode)
        config.addComponent(PreambleNode.type, PreambleComponent)

        config.addConverter('newsml', PreambleConverter)

        config.addTextType({
            name: this.name,
            data: {type: PreambleNode.type},
            command: 'switch-to-preamble'
        })

        config.addLabel('preamble', {
            en: 'Preamble',
            sv: 'Ingress'
        })

        config.addLabel('preamble.content', {
            en: 'Preamble',
            sv: 'Ingress'
        })

        config.addLabel('preamble.short', {
            en: 'Pre',
            de: 'Pre',
            sv: 'Ing'
        })

        const shortcut = pluginConfig.shortcut ? pluginConfig.shortcut : platform.isMac ? 'cmd+alt+2' : 'ctrl+alt+2'

        config.addKeyboardShortcut(shortcut, { command: 'switch-to-preamble' }, false, config.getLabelProvider().getLabel("preamble"))


    }
}
