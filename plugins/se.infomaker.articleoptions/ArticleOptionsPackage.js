import './scss/articleoptions.scss';

import ArticleOptionsComponent from './ArticleOptionsComponent'

export default {
    id: 'se.infomaker.articleoptions',
    name: 'articleoptions',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addLabel('articleoptions-label', {
            en: 'Article options',
            sv: 'Artikelinställningar'
        })

        config.addToSidebar('main', pluginConfig, ArticleOptionsComponent)
    }
}
