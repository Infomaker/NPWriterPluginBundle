import PagedatelineComponent from './PagedatelineComponent'
import PagedatelineConverter from './PagedatelineConverter'
import PagedatelineNode from './PagedatelineNode'
import TextstyleCommand from '../TextstyleCommand'

export default {
    name: 'pagedateline',
    id: 'se.infomaker.pagedateline',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-pagedateline';

        PagedatelineNode.type = this.name
        PagedatelineConverter.type = PagedatelineNode.type
        PagedatelineConverter.element = PagedatelineNode.type

        config.addNode(PagedatelineNode)
        config.addComponent(PagedatelineNode.type, PagedatelineComponent)

        config.addConverter('newsml', PagedatelineConverter)

        const textType = {
            name: this.name,
            data: {type: PagedatelineNode.type}
        }

        if (pluginConfig.shortcut) {
            config.addCommand(command, TextstyleCommand, {textType: this.name})
            config.addKeyboardShortcut({override:pluginConfig.shortcut}, { command: command }, false, config.getLabelProvider().getLabel(this.name))
            textType.command = command
        }

        config.addTextType(textType)

        config.addLabel('pagedateline', {
            en: 'Pagedateline',
            sv: 'Vinjett'
        })

        config.addLabel('pagedateline.content', {
            en: 'Pagedateline',
            sv: 'Vinjett'
        })

        config.addLabel('pagedateline.short', {
            en: 'PDL',
            sv: 'VIN'
        })
    }
}
