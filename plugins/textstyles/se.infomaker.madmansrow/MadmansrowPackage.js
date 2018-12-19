import MadmansrowComponent from './MadmansrowComponent'
import MadmansrowConverter from './MadmansrowConverter'
import MadmansrowNode from './MadmansrowNode'
import TextstyleCommand from '../TextstyleCommand'

export default {
    name: 'madmansrow',
    id: 'se.infomaker.madmansrow',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-madmansrow';

        MadmansrowNode.type = this.name
        MadmansrowConverter.type = MadmansrowNode.type
        MadmansrowConverter.element = MadmansrowNode.type

        config.addNode(MadmansrowNode)
        config.addComponent(MadmansrowNode.type, MadmansrowComponent)

        config.addConverter(MadmansrowConverter)

        const textType = {
            name: this.name,
            data: {type: MadmansrowNode.type}
        }

        if (pluginConfig.shortcut) {
            config.addCommand(command, TextstyleCommand, {textType: this.name})
            config.addKeyboardShortcut({override:pluginConfig.shortcut}, {command: command}, false, config.getLabelProvider().getLabel(this.name))
            textType.command = command
        }

        config.addTextType(textType)

        config.addLabel('madmansrow', {
            en: 'Madmansrow',
            sv: 'Dårrad'
        })

        config.addLabel('madmansrow.content', {
            en: 'Madmansrow',
            sv: 'Dårrad'
        })

        config.addLabel('madmansrow.short', {
            en: 'MAD',
            sv: 'DÅR'
        })
    }
}
