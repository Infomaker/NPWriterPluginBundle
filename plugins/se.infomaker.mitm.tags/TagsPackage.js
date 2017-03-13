import './scss/tags.scss'
import TagsMainComponent from './TagsMainComponent'

export default {
    id: 'se.infomaker.mitm.tags',
    name: 'mmtags',
    vendor: 'infomaker.se',
    version: '{{version}}',
    configure: function(config) {

        config.addLabel('mmtags-could_not_load_uuid', {
            en: 'This item could not be loaded. UUID: ',
            sv: 'Detta objekt kunde inte laddas in. UUID: '
        })

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

        config.addLabel('mmtags-edit',{
            en: 'Edit',
            sv: 'Redigera'
        })

        config.addLabel('mmtags-Person',{
            en: 'Person',
            sv: 'Person'
        })

        config.addLabel('mmtags-Organization',{
            en: 'Organization',
            sv: 'Organisation'
        })

        config.addLabel('mmtags-Topic', {
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
            en: 'Error when saving tag',
            sv: 'Fel vid sparande av tag'
        })

        config.addLabel('mmtags-Short_description', {
            en: 'Short description',
            sv: 'Kort beskrivning'
        })

        config.addLabel('mmtags-Long_description', {
            en: 'Long description',
            sv: 'Lång beskrivning'
        })

        config.addLabel('mmtags-Website_url', {
            en: 'Website url',
            sv: 'Länk till webbsida'
        })

        config.addLabel('mmtags-Twitter_url', {
            en: 'Twitter url',
            sv: 'Länk till Twitter'
        })

        config.addLabel('mmtags-Facebook_url', {
            en: 'Facebook url',
            sv: 'Länk till Facebook'
        })

        config.addLabel('mmtags-Remove_from_article', {
            en: 'Remove from article',
            sv: 'Ta bort från artikel'
        })


        config.addComponentToSidebarWithTabId(this.id, 'main', TagsMainComponent)
    }
}
