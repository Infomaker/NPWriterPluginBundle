import DatelineComponent from './DatelineComponent'
import DatelineConverter from './DatelineConverter'
import DatelineNode from './DatelineNode'
import TextstyleCommand from '../TextstyleCommand'

export default {
    name: 'dateline',
    id: 'se.infomaker.dateline',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-dateline';

        DatelineNode.type = this.name
        DatelineConverter.type = DatelineNode.type
        DatelineConverter.element = DatelineNode.type

        config.addNode(DatelineNode)
        config.addComponent(DatelineNode.type, DatelineComponent)

        config.addConverter('newsml', DatelineConverter)

        const textType = {
            name: this.name,
            data: {type: DatelineNode.type}
        };


        if (pluginConfig.shortcut) {
            config.addCommand(command, TextstyleCommand, {textType: this.name})
            config.addKeyboardShortcut({override: pluginConfig.shortcut}, {command: command}, false, config.getLabelProvider().getLabel(this.name))
            textType.command = command
        }

        config.addTextType(textType)

        config.addLabel('dateline', {
            en: 'Dateline',
            sv: 'Ortsdatering'
        })

        config.addLabel('dateline.content', {
            en: 'Dateline',
            sv: 'Ortsdatering'
        })

        config.addLabel('dateline.short', {
            en: 'DT',
            sv: 'DAT'
        })

    }
}
