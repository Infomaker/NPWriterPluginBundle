import {platform} from 'substance'
import './scss/index.scss'
import TeaserContainerNode from './TeaserContainerNode'
import TeaserContainerComponent from './TeaserContainerComponent'
import TeaserContainerTool from './TeaserContainerTool'
import TeaserContainerConverter from './TeaserContainerConverter'
import InsertTeaserContainerCommand from './InsertTeaserContainerCommand'

import InsertTeaserCommand from './InsertTeaserCommand'
import TeaserConverter from './TeaserConverter'
import TeaserNode from './TeaserNode'
import InsertTeaserImageCommand from './InsertTeaserImageCommand'
import InsertTeaserArticleCommand from './InsertTeaserArticleCommand'

import {idGenerator} from 'writer'

export default {
    name: 'ximteaser',
    id: 'se.infomaker.ximteaser',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        // Container
        config.addNode(TeaserContainerNode)
        config.addComponent(TeaserContainerNode.type, TeaserContainerComponent)
        config.addConverter('newsml', TeaserContainerConverter)
        config.addContentMenuTopTool('ximteasercontainer', TeaserContainerTool)
        config.addCommand('ximteasercontainer', InsertTeaserContainerCommand, pluginConfig)

        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+alt+t', { command: 'ximteasercontainer' }, false, 'Insert Teaser')
        } else {
            config.addKeyboardShortcut('ctrl+alt+t', { command: 'ximteasercontainer' }, false, 'Insert Teaser')
        }

        config.addPluginModule('se.infomaker.ximteaser.teasertemplate', (type) => {
            return {
                type: 'ximteaser',
                dataType: type,
                id: idGenerator(),
                nodes: []
            }
        })

        // Teaser
        config.addConverter('newsml', TeaserConverter)
        config.addNode(TeaserNode)
        config.addCommand('ximteaser.insert-teaser', InsertTeaserCommand)
        config.addCommand('ximteaser.insert-image', InsertTeaserImageCommand)
        config.addCommand('ximteaser.insert-article', InsertTeaserArticleCommand)

        config.addLabel('Insert Teaser', {
            sv: 'Infoga puff'
        })

        config.addLabel('Add new teaser', {
            sv: 'Lägg till ny puff'
        })

        config.addLabel('teaser-add-image', {
            en: 'Add image',
            sv: 'Lägg till bild'
        })

        config.addLabel('teaser-replace-image', {
            en: 'Replace image',
            sv: 'Ersätt bild'
        })

        config.addLabel('teaser-add-image-or-article', {
            en: 'Add image or related article',
            sv: 'Lägg till bild eller relaterad artikel'
        })

        config.addLabel('teaser-replace-image-or-article', {
            en: 'Replace image or add related article',
            sv: 'Ersätt bild eller lägg till relaterad artikel'
        })

        config.addLabel('teaser-related-articles', {
            en: 'Related articles',
            sv: 'Relaterade artiklar'
        })

        config.addLabel('teaser-related-article-not-added', {
            en: 'Could not add',
            sv: 'Kunde inte infoga'
        })

        config.addLabel('teaser-related-article-already-added', {
            en: 'The article {title} has already been added to the teaser',
            sv: 'Artikeln {title} finns redan i teasern'
        })

        config.addLabel('teaser-related-article-is-self', {
            en: 'Can not add the article to itself',
            sv: 'Kan inte infoga artikeln i sig själv'
        })
    }
}
