import { AnnotationTool, platform } from 'substance';
import { NPWriterAnnotationCommand } from 'writer';
import { pluginName, pluginId, commands, types, keyboardShortcut } from './config';
import Node from './node';
import MainAnnotationComponent from './components/annotation-component';
import XMLConverter from './xml-converter';
import labels from './labels';

import './styles/style.scss';

export default {id: pluginId,
    name: pluginName,
    configure(config, pluginConfig) {
        config.addNode(Node);
        config.addComponent(types.NODE, MainAnnotationComponent);
        config.addConverter('newsml', XMLConverter);

        config.addCommand(commands.NODE, NPWriterAnnotationCommand, {
            nodeType: types.NODE,
            commandGroup: 'annotations',
        });

        config.addTool(commands.NODE, AnnotationTool, {
            toolGroup: 'overlay'
        });


        const icon = (pluginConfig.data && pluginConfig.data.icon) ? pluginConfig.data.icon : 'fa-paint-brush';
        config.addIcon(commands.NODE, {
            fontawesome: icon
        });

        labels.forEach((label) => {
            config.addLabel(
                label.original,
                label.translations,
            );
        });

        if (platform.isMac) {
            // e.g. 'cmd+g'
            config.addKeyboardShortcut(keyboardShortcut.MAC, { command: commands.NODE });
        }
        else {
            // e.g. 'ctrl+g'
            config.addKeyboardShortcut(keyboardShortcut.MAIN, { command: commands.NODE });
        }
    },
};
