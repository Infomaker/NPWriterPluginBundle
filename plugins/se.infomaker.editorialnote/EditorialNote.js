import EditorialNoteComponent from './EditorialNoteComponent'

export default {
    id: 'se.infomaker.editorialnote',
    name: 'editorialnote',
    version: '{{version}}',
    configure: function(config) {

        config.addLabel('Editorial note', {
            sv: 'Redaktionell anteckning'
        })

        config.addComponentToSidebarWithTabId(
            'editorialnote',
            'main',
            EditorialNoteComponent
        )
    }
}
