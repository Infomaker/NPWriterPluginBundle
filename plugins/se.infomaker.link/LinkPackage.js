import './scss/link.scss'
import LinkNode from './LinkNode'
import LinkComponent from './LinkComponent'
import LinkCommand from './LinkCommand'
import EditLinkCommand from './EditLinkCommand'
import LinkXMLConverter from './LinkXMLConverter'
import {AnnotationTool, platform} from 'substance'
import EditLinkTool from './EditLinkTool'

export default {
    name: 'link',
    id: 'se.infomaker.link',
    version: '{{version}}',
    configure: function (config) {

        config.addNode(LinkNode)
        config.addComponent('link', LinkComponent)
        config.addConverter(LinkXMLConverter)

        config.addCommand('link', LinkCommand, {
            nodeType: 'link',
            // disableCollapsedCursor
        })

        config.addCommand('edit-link', EditLinkCommand, {
            nodeType: 'link'
        })

        config.addTool('link', AnnotationTool, {
            toolGroup: 'overlay'
        })

        config.addTool('edit-link', EditLinkTool, {
            toolGroup: 'overlay'
        })

        config.addIcon('link', {'fontawesome': 'fa-link'})
        config.addIcon('open-link', {'fontawesome': 'fa-external-link'})

        config.addLabel('link', {
            en: 'Link',
            sv: 'Länk'
        })

        config.addLabel('open-link', {
            en: 'Open Link',
            sv: 'Öppna länk'
        })

        config.addLabel('ALT+k to edit', {
            en: 'ALT+k to edit',
            sv: 'Redigera med ALT+k'
        })

        config.addLabel('delete-link', {
            en: 'Remove Link',
            sv: 'Ta bort länk'
        })

        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+k', {command: 'link'}, false, 'link')
        }
        else {
            config.addKeyboardShortcut('ctrl+k', {command: 'link'}, false, 'link')
        }
    }
}
