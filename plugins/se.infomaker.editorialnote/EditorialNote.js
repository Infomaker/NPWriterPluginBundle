import EditorialNoteComponent from './EditorialNoteComponent'

export default {
    id: 'se.infomaker.editorialnote',
    name: 'editorialnote',
    version: '{{version}}',
    configure: function(config) {

        config.addLabel('publicationchannel-Channels', {
            en: 'Channels',
            sv: 'Publiceringskanaler'
        })

        config.addComponentToSidebarWithTabId(
            'editorialnote',
            'main',
            EditorialNoteComponent
        )
    }
}
