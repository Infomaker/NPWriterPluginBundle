import './scss/tags.scss'
import TagsMainComponent from './TagsMainComponent'

export default {
    id: 'se.infomaker.mitm.tags',
    name: 'mmtags',
    vendor: 'infomaker.se',

    configure: function(config) {

        config.addLabel('mmtags-title',{
            sv: 'Organisationer/personer/ämnen',
            en: 'Organizations/persons/topics'
        })

        config.addLabel('mmtags-search_placeholder',{
            sv: 'Sök Organisationer/personer/ämnen',
            en: 'Search Organizations/persons/topics'
        })

        config.addLabel('mmtags-create',{
            en: 'Create',
            sv: 'Skapa'
        })

        config.addLabel('mmtags-save',{
            en: 'Save',
            sv: 'Spara'
        })

        config.addLabel('mmtags-Person',{
            en: 'Person',
            sv: 'Person'
        })

        config.addLabel('mmtags-Organization',{
            en: 'Organization',
            sv: 'Organisation'
        })

        config.addLabel('mm-Topic', {
            en: 'Topic',
            sv: 'Ämne'
        })

        config.addLabel('mmtags-type-question-label', {
            en: 'What kind of tag do you want to create?',
            sv: 'Vilken typ vill du skapa?'
        })

        config.addLabel('mmtags-name_already_in_use', {
            en: 'Please note that this name is already in use',
            sv: 'Observera att namnet redan används'
        })

        config.addLabel('mmtags-error-save', {
            en: 'Error when saving story: ',
            sv: 'Fel vid sparande av story: '
        })


        config.addComponentToSidebarWithTabId(this.id, 'main', TagsMainComponent)
    }
}
