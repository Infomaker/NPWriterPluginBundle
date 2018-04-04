import { AnnotationTool, platform } from 'substance'
import { NPWriterAnnotationCommand } from 'writer'
import MarkerNode from './MarkerNode'
import MarkerComponent from './MarkerComponent'
import MarkerConverter from './MarkerConverter'

export default {
    name: 'marker',

    configure(config, pluginConfig) {
        let nodeType = 'mark'
        let commandName = 'highlighted text'
        let tagName = 'mark'
        let style = null

        // Override node name if configured to do so
        if (pluginConfig.data && pluginConfig.data.type) {
            nodeType = pluginConfig.data.type
        }

        // Override component getTagName() if needed
        if (pluginConfig.data && pluginConfig.data.tagName) {
            tagName = pluginConfig.data.tagName
        }

        // Override command name if configured
        if (pluginConfig.data && pluginConfig.data.commandName) {
            commandName = pluginConfig.data.commandName
        }

        // Override background color for the marker
        if (pluginConfig.data && pluginConfig.data.style) {
            style = pluginConfig.data.style
        }

        const node = MarkerNode(nodeType)
        const component = MarkerComponent(tagName, style)
        const converter = MarkerConverter(nodeType, tagName)

        config.addNode(node)
        config.addComponent(nodeType, component)
        config.addConverter('newsml', converter)

        config.addCommand(commandName, NPWriterAnnotationCommand, {
            nodeType: nodeType,
            commandGroup: 'annotations',
        })

        config.addTool(commandName, AnnotationTool, {
            toolGroup: 'overlay'
        })

        const icon = (pluginConfig.data && pluginConfig.data.icon) ? pluginConfig.data.icon : 'fa-paint-brush'
        config.addIcon(commandName, {
            fontawesome: icon
        })

        config.addLabel('highlighted text', {
            sv: 'markerad text'
        })

        config.addKeyboardShortcut(
            {
                standard: null,
                override: pluginConfig.shortcut
            },
            {
                command: commandName
            }
        )
    },
}
