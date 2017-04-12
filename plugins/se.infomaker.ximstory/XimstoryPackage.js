import './scss/ximstory.scss'

import StoryMainComponent from './StoryMainComponent'

export default {
    id: 'se.infomaker.ximstory',
    name: 'ximstory',
    version: '{{version}}',
    configure: function(config) {
        config.addLabel('ximstory-could_not_load_uuid', {
            en: 'This item could not be loaded. UUID: ',
            sv: 'Detta objekt kunde inte laddas in. UUID: '
        })

        config.addLabel('ximstory-search_stories', {
            en: 'Search stories',
            sv: 'Sök stories'
        })

        config.addLabel('ximstory-Save', {
            en: 'Save',
            sv: 'Spara'
        })

        config.addLabel('ximstory-create', {
            en: 'Create ',
            sv: 'Skapa '
        })

        config.addLabel('ximstory-remove_from_article', {
            en: 'Remove from article',
            sv: 'Ta bort från artikel'
        })

        config.addLabel('ximstory-name_already_in_use', {
            en: 'Please note that this name is already in use',
            sv: 'Observera att namnet redan används'
        })

        config.addLabel('ximstory-error-save', {
            en: 'Error when saving story',
            sv: 'Fel vid sparande av story'
        })

        config.addLabel('ximstory-Name', {
            en: 'Name',
            sv: 'Namn'
        })

        config.addLabel('ximstory-short_description', {
            en: 'Short description',
            sv: 'Kort beskrivning'
        })

        config.addLabel('ximstory-long_description', {
            en: 'Long description',
            sv: 'Lång beskrivning'
        })

        config.addLabel('ximstory-story', {
            en: 'Story',
            sv: 'Story'
        })

        config.addComponentToSidebarWithTabId(this.id, 'main', StoryMainComponent)
    }
}
