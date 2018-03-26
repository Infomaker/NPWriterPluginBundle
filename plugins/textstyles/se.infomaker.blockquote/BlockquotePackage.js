import {registerPlugin} from 'writer'
import Blockquote from './Blockquote'
import BlockquoteComponent from './BlockquoteComponent'
import BlockquoteConverter from './BlockquoteConverter'
import TextstyleCommand from '../TextstyleCommand'

const blockquotePackage = {
    id: 'se.infomaker.blockquote',
    name: 'blockquote',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const commandName = 'switch-to-blockquote';
        config.addCommand(commandName, TextstyleCommand, {textType: this.name})

        config.addNode(Blockquote)
        config.addComponent(Blockquote.type, BlockquoteComponent)
        config.addConverter('newsml', BlockquoteConverter)

        config.addTextType({
            name: 'blockquote',
            data: {type: this.name},
            command: commandName
        })

        config.addLabel(this.name, {
            en: 'Blockquote',
            de: 'Blockequote',
            sv: 'Citat'
        })

        config.addLabel('blockquote.content', {
            en: 'Blockequote',
            de: 'Blockequote',
            sv: "Citat"
        })

        config.addLabel('blockquote.short', {
            en: 'QUO',
            de: 'QUO',
            sv: "CIT"
        })

        const combos = {
            override: pluginConfig.shortcut,
            standard: {
                "default": 'ctrl+alt+4',
                "mac": 'cmd+alt+4'}
        }

        config.addKeyboardShortcut(combos, {command: commandName}, false, config.getLabelProvider().getLabel(this.name))

    }
};


export default () => {
    if (registerPlugin) {
        registerPlugin(blockquotePackage)
    } else {
        console.info("Register method not yet available");
    }
}
