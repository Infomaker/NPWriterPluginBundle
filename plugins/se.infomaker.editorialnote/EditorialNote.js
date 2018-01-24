import EditorialNoteComponent from './EditorialNoteComponent'

export default {
    id: 'se.infomaker.editorialnote',
    name: 'editorialnote',
    version: '{{version}}',
    configure: function(config, pluginConfig) {

        config.addLabel('Editorial note', {
            sv: 'Redaktionell anteckning'
        })

        config.addToSidebar('main', pluginConfig, EditorialNoteComponent)
    }
}
