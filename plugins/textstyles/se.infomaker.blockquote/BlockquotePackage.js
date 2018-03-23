import {platform} from 'substance'
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
        config.addCommand(commandName, TextstyleCommand, {textType: blockquotePackage.name})

        config.addNode(Blockquote)
        config.addComponent(Blockquote.type, BlockquoteComponent)
        config.addConverter('newsml', BlockquoteConverter)

        config.addTextType({
            name: 'blockquote',
            data: {type: 'blockquote'},
            command: commandName
        })

        config.addLabel('blockquote', {
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

        const shortcut = pluginConfig.shortcut ? pluginConfig.shortcut : platform.isMac ? 'cmd+alt+3' : 'ctrl+alt+3'

        config.addKeyboardShortcut(shortcut, { command: commandName }, false, config.getLabelProvider().getLabel('blockquote'))

    }
};


export default () => {
    if (registerPlugin) {
        registerPlugin(blockquotePackage)
    } else {
        console.info("Register method not yet available");
    }
}
