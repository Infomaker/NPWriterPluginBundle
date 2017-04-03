import ArticlePartCommand from './ArticlePartCommand'
import ArticlePartComponent from './ArticlePartComponent'
import ArticlePartConverter from './ArticlePartConverter'
import ArticlePartNode from './ArticlePartNode'
import ArticlePartTool from './ArticlePartTool'
import './scss/articlepart.scss'

export default {
    name: 'articlepart',
    id: 'se.infomaker.articlepart',
    configure: function (config) {
        config.addNode(ArticlePartNode)
        config.addContentMenuTopTool('insert-articlepart', ArticlePartTool)
        config.addCommand('insert-articlepart', ArticlePartCommand)
        config.addComponent('articlepart', ArticlePartComponent)
        config.addConverter('newsml', ArticlePartConverter)

        config.addLabel('title', {
            sv: 'Rubrik',
            en: 'Headline'
        })

        // TODO: get from config or?
        config.addLabel('vignette', {
            sv: 'Fakta',
            en: 'Fact'
        })

        config.addLabel('Factbox', {
            sv: 'Faktaruta'
        })

        config.addLabel('Add article part', {
            sv: 'Lägg till artikeldel'
        })
    }
}
