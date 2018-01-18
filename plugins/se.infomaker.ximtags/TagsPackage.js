import './scss/tags.scss'
import TagsMainComponent from './TagsMainComponent'

export default {
    id: 'se.infomaker.ximtags',
    name: 'ximtags',
    vendor: 'infomaker.se',
    version: '{{version}}',
    configure: function(config, pluginConfig) {

        config.addLabel('ximtags-could_not_load_uuid', {
            en: 'This item could not be loaded. UUID: ',
            sv: 'Detta objekt kunde inte laddas in. UUID: '
        })

        config.addLabel('ximtags-title',{
            sv: 'Taggar',
            en: 'Tags'
        })

        config.addLabel('ximtags-search_placeholder',{
            sv: 'Sök taggar',
            en: 'Search tags'
        })

        config.addLabel('ximtags-create',{
            en: 'Create',
            sv: 'Skapa'
        })

        config.addLabel('ximtags-save',{
            en: 'Save',
            sv: 'Spara'
        })

        config.addLabel('ximtags-edit',{
            en: 'Edit',
            sv: 'Redigera'
        })

        config.addLabel('ximtags-Person',{
            en: 'Person',
            sv: 'Person'
        })

        config.addLabel('ximtags-Organization',{
            en: 'Organization',
            sv: 'Organisation'
        })

        config.addLabel('ximtags-Topic', {
            en: 'Topic',
            sv: 'Ämne'
        })

        config.addLabel('ximtags-type-question-label', {
            en: 'What kind of tag do you want to create?',
            sv: 'Vilken typ vill du skapa?'
        })

        config.addLabel('ximtags-name_already_in_use', {
            en: 'Please note that this name is already in use',
            sv: 'Observera att namnet redan används'
        })

        config.addLabel('ximtags-error-save', {
            en: 'Error when saving tag',
            sv: 'Fel vid sparande av tagg'
        })

        config.addLabel('ximtags-Short_description', {
            en: 'Short description',
            sv: 'Kort beskrivning'
        })

        config.addLabel('ximtags-Long_description', {
            en: 'Long description',
            sv: 'Lång beskrivning'
        })

        config.addLabel('ximtags-Website_url', {
            en: 'Website url',
            sv: 'Länk till webbsida'
        })

        config.addLabel('ximtags-Twitter_url', {
            en: 'Twitter url',
            sv: 'Länk till Twitter'
        })

        config.addLabel('ximtags-Facebook_url', {
            en: 'Facebook url',
            sv: 'Länk till Facebook'
        })

        config.addLabel('ximtags-Remove_from_article', {
            en: 'Remove from article',
            sv: 'Ta bort från artikel'
        })


        config.addToSidebar('main', pluginConfig, TagsMainComponent)
    }
}
