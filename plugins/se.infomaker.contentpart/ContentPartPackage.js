import InserContentPartCommand from './InserContentPartCommand'
import ContentPartComponent from './ContentPartComponent'
import ContentPartConverter from './ContentPartConverter'
import ContentPartNode from './ContentPartNode'
import InsertContentPartTool from './InsertContentPartTool'
import './scss/index.scss'
import {platform} from 'substance'

export default {
    name: 'contentpart',
    id: 'se.infomaker.contentpart',
    configure: function (config) {
        config.addNode(ContentPartNode)
        config.addContentMenuTopTool('insert-contentpart', InsertContentPartTool)
        config.addCommand('insert-contentpart', InserContentPartCommand)
        config.addComponent('contentpart', ContentPartComponent)
        config.addConverter('newsml', ContentPartConverter)


        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+alt+c', { command: 'insert-contentpart' }, false, 'Add content part')
        } else {
            config.addKeyboardShortcut('ctrl+alt+c', { command: 'insert-contentpart' }, false, 'Add content part')
        }


        config.addLabel('Add content part', {
            sv: 'Infoga innehållsdel',
            en: 'Add content part'
        })
        config.addLabel('title', {
            sv: 'Rubrik',
            en: 'Headline'
        })

        config.addLabel('vignette', {
            sv: 'Fakta',
            en: 'Fact'
        })

        config.addLabel('Contentpart', {
            sv: 'Innehållsdel'
        })
    }
}
