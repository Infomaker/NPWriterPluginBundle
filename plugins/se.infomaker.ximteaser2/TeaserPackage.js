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
import TeaserComponent from './TeaserComponent'
import InsertTeaserImageCommand from './InsertTeaserImageCommand'

import {idGenerator} from 'writer'

export default {
    name: 'ximteaser2',
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

        // config.addIcon('ximteaser', { 'fontawesome': ' fa-newspaper-o' })

        // Teaser
        config.addConverter('newsml', TeaserConverter)
        config.addNode(TeaserNode)
        config.addComponent(TeaserComponent.type, TeaserComponent)
        config.addCommand('insertTeaser', InsertTeaserCommand)
        config.addCommand('insertTeaserImage', InsertTeaserImageCommand)

        config.addLabel('Insert Teaser', {
            en: 'Insert Teaser',
            sv: 'Infoga puff'
        })
        config.addLabel('teaser-add-image', {
            en: 'Add image',
            sv: 'Lägg till bild'
        })
        config.addLabel('teaser-replace-image', {
            en: 'Replace image',
            sv: 'Ersätt bild'
        })
    }
}