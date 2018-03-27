import PreleadinComponent from './PreleadinComponent'
import PreleadinConverter from './PreleadinConverter'
import PreleadinNode from './PreleadinNode'
import TextstyleCommand from '../TextstyleCommand'

export default {
    name: 'preleadin',
    id: 'se.infomaker.preleadin',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-preleadin';

        PreleadinNode.type = this.name
        PreleadinConverter.type = PreleadinNode.type
        PreleadinConverter.element = PreleadinNode.type

        config.addNode(PreleadinNode)
        config.addComponent(PreleadinNode.type, PreleadinComponent)

        config.addConverter('newsml', PreleadinConverter)

        const textType = {
            name: this.name,
            data: {type: PreleadinNode.type}
        }

        if (pluginConfig.shortcut) {
            config.addCommand(command, TextstyleCommand, {textType: this.name})
            config.addKeyboardShortcut({override:pluginConfig.shortcut}, { command: command }, false, config.getLabelProvider().getLabel(this.name))
            textType.command = command
        }

        config.addTextType(textType)

        config.addLabel('preleadin', {
            en: 'Preleadin',
            sv: 'Överingress'
        })

        config.addLabel('preleadin.content', {
            en: 'Preleadin',
            sv: 'Överingress'
        })

        config.addLabel('preleadin.short', {
            en: 'PL',
            de: 'PL',
            sv: 'ÖI'
        })

    }
}
