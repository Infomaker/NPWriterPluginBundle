import {registerPlugin} from 'writer'
import Subheadline from './Subheadline'
import SubheadlineComponent from './SubheadlineComponent'
import SubheadlineConverter from './SubheadlineConverter'
import TextstyleCommand from "../TextstyleCommand";

const subheadlinePackage = {
    id: 'se.infomaker.subheadline',
    name: 'subheadline',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        const command = 'switch-to-subheadline'
        config.addCommand(command, TextstyleCommand, {textType: this.name})
        config.addNode(Subheadline)
        config.addComponent(Subheadline.type, SubheadlineComponent)
        config.addConverter('newsml', SubheadlineConverter)
        config.addTextType({
            name: 'subheadline',
            data: {type: 'subheadline'},
            command: command
        })

        config.addLabel('subheadline', {
            en: 'Subheadline',
            de: 'Subheadline',
            sv: 'Underrubrik'
        })

        config.addLabel('subheadline.content', {
            en: 'Subheadline',
            de: 'Subheadline',
            sv: 'Underrubrikrik'
        })

        config.addLabel('subheadline.short', {
            en: 'H2',
            de: 'H2',
            sv: 'UR'
        })

        const combos = {
            override: pluginConfig.shortcut,
            standard: {
                "default": 'ctrl+alt+2',
                "mac": 'cmd+alt+2'
            }
        }

        config.addKeyboardShortcut(combos, {command: command}, false, config.getLabelProvider().getLabel(this.name))

    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(subheadlinePackage)
    } else {
        console.info("Register method not yet available");
    }
}
