import DropheadComponent from './DropheadComponent'
import DropheadConverter from './DropheadConverter'
import DropheadNode from './DropheadNode'
import TextstyleCommand from '../TextstyleCommand'

export default {
    name: 'drophead',
    id: 'se.infomaker.drophead',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-drophead';

        DropheadNode.type = this.name
        DropheadConverter.type = DropheadNode.type
        DropheadConverter.element = DropheadNode.type

        config.addNode(DropheadNode)
        config.addComponent(DropheadNode.type, DropheadComponent)

        config.addConverter(DropheadConverter)

        const textType = {
            name: this.name,
            data: {type: DropheadNode.type}
        };

        if (pluginConfig.shortcut) {
            config.addCommand(command, TextstyleCommand, {textType: this.name})
            config.addKeyboardShortcut({override: pluginConfig.shortcut}, {command: command}, false, config.getLabelProvider().getLabel(this.name))
            textType.command = command
        }

        config.addTextType(textType)

        config.addLabel('drophead', {
            en: 'Drophead',
            sv: 'Nedryckare'
        })

        config.addLabel('drophead.content', {
            en: 'Drophead',
            sv: 'Nedryckare'
        })

        config.addLabel('drophead.short', {
            en: 'DH',
            sv: 'NED'
        })
    }
}
