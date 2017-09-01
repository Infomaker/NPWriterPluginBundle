import {platform} from 'substance'

import TeaserContainerNode from './TeaserContainerNode'
import TeaserContainerComponent from './TeaserContainerComponent'
import TeaserContainerTool from './TeaserContainerTool'
import TeaserContainerConverter from './TeaserContainerConverter'
import InsertTeaserContainerCommand from './InsertTeaserContainerCommand'

export default {
    name: 'ximteaser2',
    id: 'se.infomaker.ximteaser2',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addNode(TeaserContainerNode)
        config.addComponent(TeaserContainerNode.type, TeaserContainerComponent)

        config.addConverter('newsml', TeaserContainerConverter)

        config.addContentMenuTopTool('ximteasercontainer', TeaserContainerTool)
        config.addCommand('ximteasercontainer', InsertTeaserContainerCommand, pluginConfig)

        // config.addCommand('ximteaserinsertimage', XimteaserInsertImageCommand, pluginConfig)

        // config.addIcon('ximteaser', { 'fontawesome': ' fa-newspaper-o' })


        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+alt+t', { command: 'ximteasercontainer' })
        } else {
            config.addKeyboardShortcut('ctrl+alt+t', { command: 'ximteasercontainer' })
        }

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