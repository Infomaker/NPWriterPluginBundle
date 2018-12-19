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
        config.addCommand(command, TextstyleCommand, {textType: this.name})
        config.addNode(Paragraph)
        config.addComponent(Paragraph.type, ParagraphComponent)
        config.addConverter(ParagraphConverter)
        config.addTextType({
            name: 'paragraph',
            data: {type: 'paragraph'},
            command: command
        })

        config.addLabel(this.name, {
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

        const combos = {
            override: pluginConfig.shortcut,
            standard: {
                "default": 'ctrl+alt+0',
                "mac": 'cmd+alt+0'
            }
        }

        config.addKeyboardShortcut(combos, {command: command}, false, config.getLabelProvider().getLabel(this.name))

    }
};

export default () => {
    if (registerPlugin) {
        registerPlugin(paragraphPackage)
    } else {
        console.info("Register method not yet available");
    }
}
