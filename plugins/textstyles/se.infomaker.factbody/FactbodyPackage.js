import FactbodyComponent from './FactbodyComponent'
import FactbodyConverter from './FactbodyConverter'
import FactbodyNode from './FactbodyNode'
import TextstyleCommand from '../TextstyleCommand'

export default {
    name: 'factbody',
    id: 'se.infomaker.factbody',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-factbody';

        FactbodyNode.type = this.name
        FactbodyConverter.type = this.name
        FactbodyConverter.element = this.name


        config.addNode(FactbodyNode)
        config.addComponent(FactbodyNode.type, FactbodyComponent)

        config.addConverter(FactbodyConverter)

        const textType = {
            name: this.name,
            data: {type: FactbodyNode.type}
        }

        if (pluginConfig.shortcut) {
            config.addCommand(command, TextstyleCommand, {textType: this.name})
            config.addKeyboardShortcut({override: pluginConfig.shortcut}, {command: command}, false, config.getLabelProvider().getLabel(this.name))
            textType.command = command
        }

        config.addTextType(textType)

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
