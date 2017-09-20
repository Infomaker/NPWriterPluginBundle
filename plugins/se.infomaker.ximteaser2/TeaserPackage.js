import {platform} from 'substance'
import './scss/index.scss'
import TeaserContainerNode from './TeaserContainerNode'
import TeaserContainerComponent from './TeaserContainerComponent'
import TeaserContainerTool from './TeaserContainerTool'
import TeaserContainerConverter from './TeaserContainerConverter'
import InsertTeaserContainerCommand from './InsertTeaserContainerCommand'

import InsertTeaserCommand from './InsertTeaserCommand'
import TeaserConverter from './TeaserConverter'
import TeaserNode from './TeaserNode'
import InsertTeaserImageCommand from './InsertTeaserImageCommand'

import {idGenerator} from 'writer'

export default {
    name: 'ximteaser',
    id: 'se.infomaker.ximteaser2',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        // Container
        config.addNode(TeaserContainerNode)
        config.addComponent(TeaserContainerNode.type, TeaserContainerComponent)
        config.addConverter('newsml', TeaserContainerConverter)
        config.addContentMenuTopTool('ximteasercontainer', TeaserContainerTool)
        config.addCommand('ximteasercontainer', InsertTeaserContainerCommand, pluginConfig)

        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+alt+t', { command: 'ximteasercontainer' })
        } else {
            config.addKeyboardShortcut('ctrl+alt+t', { command: 'ximteasercontainer' })
        }

        config.addPluginModule('se.infomaker.ximteaser2.teasertemplate', (type) => {
            return {
                type: 'ximteaser',
                dataType: type,
                id: idGenerator()
            }
        })

        // Teaser
        config.addConverter('newsml', TeaserConverter)
        config.addNode(TeaserNode)
        config.addCommand('ximteaser.insert-teaser', InsertTeaserCommand)
        config.addCommand('ximteaser.insert-image', InsertTeaserImageCommand)

        config.addLabel('Insert Teaser', {
            sv: 'Infoga puff'
        })
        config.addLabel('Add Image', {
            sv: 'Lägg till bild'
        })
        config.addLabel('Replace Image', {
            sv: 'Ersätt bild'
        })
    }
}