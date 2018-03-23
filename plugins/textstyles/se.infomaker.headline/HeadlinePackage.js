import {platform} from 'substance'
import {registerPlugin} from 'writer'
import Headline from './Headline'
import HeadlineComponent from './HeadlineComponent'
import HeadlineConverter from './HeadlineConverter'
import TextstyleCommand from '../TextstyleCommand'

const headlinePackage = {
    id: 'se.infomaker.headline',
    name: 'headline',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-headline';
        config.addCommand(command, TextstyleCommand, {textType: this.name})
        config.addNode(Headline)
        config.addComponent(Headline.type, HeadlineComponent)
        config.addConverter('newsml', HeadlineConverter)
        config.addTextType({
            name: this.name,
            data: {type: 'headline'},
            command: command
        })

        const headlineLbl = {
            en: 'Headline',
            de: 'Headline',
            sv: 'Rubrik'
        }

        config.addLabel('headline.content', headlineLbl)

        config.addLabel(this.name, headlineLbl)

        config.addLabel('headline.short', {
            en: 'H1',
            de: 'H1',
            sv: 'RUB'
        })

        const shortcut = pluginConfig.shortcut ? pluginConfig.shortcut : platform.isMac ? 'cmd+alt+1' : 'ctrl+alt+1'

        config.addKeyboardShortcut(shortcut, { command: command }, false, config.getLabelProvider().getLabel(this.name))

    }
};

export default () => {
    if (registerPlugin) {
        registerPlugin(headlinePackage)
    } else {
        console.info("Register method not yet available");
    }
}
