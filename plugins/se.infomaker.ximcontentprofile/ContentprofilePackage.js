import ContentprofileMainComponent from './ContentprofileMainComponent'

export default {
    id: 'se.infomaker.ximcontentprofile',
    name: 'ximcontentprofile',
    version: '{{version}}',
    configure: function (config, pluginConfig) {
        config.addToSidebar('main', pluginConfig, ContentprofileMainComponent)
        config.addLabel('Search content profile tags', {
            sv: 'Sök Funktionstaggar'
        })
        config.addLabel('Content profile tags', {
            sv: 'Funktionstaggar'
        })
    }
}
