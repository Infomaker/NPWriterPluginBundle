import ContentprofileMainComponent from './ContentprofileMainComponent'

export default {
    id: 'se.infomaker.ximcontentprofile',
    name: 'ximcontentprofile',
    configure: function (config) {
        config.addComponentToSidebarWithTabId(this.id, 'main', ContentprofileMainComponent)
        config.addLabel('Search content profile tags', {
            sv: 'Sök Funktionstaggar'
        })
        config.addLabel('Content profile tags', {
            sv: 'Funktionstaggar'
        })
    }
}
