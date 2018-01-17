import './scss/articletype.scss';

import ArticleTypeComponent from './ArticleTypeComponent'

export default {
    id: 'se.infomaker.articletype',
    name: 'articletype',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addLabel('articletype-label', {
            en: 'Article type',
            sv: 'Artikeltyp'
        });

        config.addToSidebar('main', pluginConfig, ArticleTypeComponent)
    }
}
