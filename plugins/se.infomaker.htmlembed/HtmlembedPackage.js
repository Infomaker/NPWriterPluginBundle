import {registerPlugin} from 'writer'
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
    version: '{{version}}',
    configure: (config) => {

        config.addContentMenuTopTool(htmlEmbedPackage.name, HtmlembedTool)

        config.addCommand(htmlEmbedPackage.name, HtmlembedCommand)
        config.addCommand('htmlembededit', HtmlembedEditCommand)

        config.addNode(HtmlembedNode)

        config.addComponent(htmlEmbedPackage.name, HtmlembedComponent)

        config.addConverter(HtmlembedConverter)

        config.addLabel('Edit embed code', {
            sv: 'Redigera embedkod'
        })

        config.addLabel('htmlembed-insert', {
            en: 'Insert HTML embed',
            sv: 'Infoga inbäddad HTML'
        })

        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+alt+h', { command: 'htmlembed' }, false, 'htmlembed-insert')
        } else {
            config.addKeyboardShortcut('ctrl+alt+h', { command: 'htmlembed' }, false, 'htmlembed-insert')
        }

    }
}

export default () => {
    registerPlugin(htmlEmbedPackage)
}
