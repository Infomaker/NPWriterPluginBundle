
import {platform} from 'substance'
import './scss/htmlembed.scss'
import HtmlembedNode from './HtmlembedNode'
import HtmlembedConverter from './HtmlembedConverter'
import HtmlembedComponent from './HtmlembedComponent'

import HtmlembedTool from './HtmlembedTool'
import HtmlembedCommand from './HtmlembedCommand'

import HtmlembedEditCommand from './HtmlembedEditCommand'

const htmlEmbedPackage = {
    id: 'se.infomaker.htmlembed',
    name: 'htmlembed',
    configure: (config) => {

        config.addContentMenuTopTool(htmlEmbedPackage.name, HtmlembedTool)

        config.addCommand(htmlEmbedPackage.name, HtmlembedCommand)
        config.addCommand('htmlembededit', HtmlembedEditCommand)

        config.addNode(HtmlembedNode)

        config.addComponent(htmlEmbedPackage.name, HtmlembedComponent)

        config.addConverter('newsml', HtmlembedConverter)

        config.addLabel('Edit embed code', {
            sv: 'Redigera embedkod'
        })

        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+alt+h', { command: 'htmlembed' })
        } else {
            config.addKeyboardShortcut('ctrl+alt+h', { command: 'htmlembed' })
        }

    }
}
export default htmlEmbedPackage
