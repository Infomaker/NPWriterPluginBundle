import './scss/tags.scss'
import TagsMainComponent from './TagsMainComponent'

export default {
    id: 'se.infomaker.hdsds.tags',
    name: 'hdsdstags',
    vendor: 'infomaker.se',

    configure: function(config) {

        config.addLabel('hdsds-tagscould_not_load_uuid', {
            en: 'This item could not be loaded. UUID: ',
            sv: 'Detta objekt kunde inte laddas in. UUID: '
        })

        config.addLabel('hdsds-tagstitle',{
            sv: 'Taggar',
            en: 'Tags'
        })

        config.addLabel('hdsds-tagssearch_placeholder',{
            sv: 'Sök taggar',
            en: 'Search tags'
        })

        config.addLabel('hdsds-tagscreate',{
            en: 'Create',
            sv: 'Skapa'
        })

        config.addLabel('hdsds-tagssave',{
            en: 'Save',
            sv: 'Spara'
        })

        config.addLabel('hdsds-tagsedit',{
            en: 'Edit',
            sv: 'Redigera'
        })

        config.addLabel('hdsds-tagsPerson',{
            en: 'Person',
            sv: 'Person'
        })

        config.addLabel('hdsds-tagsOrganization',{
            en: 'Organization',
            sv: 'Organisation'
        })

        config.addLabel('hdsds-tagsTopic', {
            en: 'Topic',
            sv: 'Ämne'
        })

        config.addLabel('hdsds-tagstype-question-label', {
            en: 'What kind of tag do you want to create?',
            sv: 'Vilken typ vill du skapa?'
        })

        config.addLabel('hdsds-tagsname_already_in_use', {
            en: 'Please note that this name is already in use',
            sv: 'Observera att namnet redan används'
        })

        config.addLabel('hdsds-tagserror-save', {
            en: 'Error when saving tag',
            sv: 'Fel vid sparande av tag'
        })

        config.addLabel('hdsds-tagsShort_description', {
            en: 'Short description',
            sv: 'Kort beskrivning'
        })

        config.addLabel('hdsds-tagsLong_description', {
            en: 'Long description',
            sv: 'Lång beskrivning'
        })

        config.addLabel('hdsds-tagsWebsite_url', {
            en: 'Website url',
            sv: 'Länk till webbsida'
        })

        config.addLabel('hdsds-tagsTwitter_url', {
            en: 'Twitter url',
            sv: 'Länk till Twitter'
        })

        config.addLabel('hdsds-tagsFacebook_url', {
            en: 'Facebook url',
            sv: 'Länk till Facebook'
        })

        config.addLabel('hdsds-tagsRemove_from_article', {
            en: 'Remove from article',
            sv: 'Ta bort från artikel'
        })


        config.addComponentToSidebarWithTabId(this.id, 'main', TagsMainComponent)
    }
}
