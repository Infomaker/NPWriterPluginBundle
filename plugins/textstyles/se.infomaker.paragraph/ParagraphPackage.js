import {platform} from 'substance'
import {registerPlugin} from 'writer'
import TextstyleCommand from '../TextstyleCommand'

import Paragraph from './Paragraph'
import ParagraphComponent from './ParagraphComponent'
import ParagraphConverter from './ParagraphConverter'

const paragraphPackage = {
    id: 'se.infomaker.paragraph',
    name: 'paragraph',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-paragraph';
        config.addCommand(command, TextstyleCommand, {textType: paragraphPackage.name})
        config.addNode(Paragraph)
        config.addComponent(Paragraph.type, ParagraphComponent)
        config.addConverter('newsml', ParagraphConverter)
        config.addTextType({
            name: 'paragraph',
            data: {type: 'paragraph'},
            command: command
        })

        config.addLabel('paragraph', {
            en: 'Paragraph',
            de: 'Paragraph'
        })

        config.addLabel('paragraph.content', {
            en: 'Paragraph',
            de: 'Paragraph'
        })

        config.addLabel('paragraph.short', {
            en: '¶',
            sv: '¶'
        })

        const shortcut = pluginConfig.shortcut ? pluginConfig.shortcut : platform.isMac ? 'cmd+alt+0' : 'ctrl+alt+0'

        config.addKeyboardShortcut(shortcut, { command: command }, false, config.getLabelProvider().getLabel('paragraph'))

    }
};

export default () => {
    if (registerPlugin) {
        registerPlugin(paragraphPackage)
    } else {
        console.info("Register method not yet available");
    }
}
