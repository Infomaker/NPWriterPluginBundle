import './scss/author.scss'
import './scss/_authorinfo.scss'
import AuthorMainComponent from './AuthorMainComponent'
import AuthorValidation from './AuthorValidation'

export default {
    id: 'se.infomaker.ximauthor',
    name: 'ximauthor',
    version: '{{version}}',
    configure: function (config) {
        config.addLabel('validation-no-author', {
            en: 'No author specified',
            sv: 'Ingen författare är vald'
        })
        config.addLabel('Search authors', {
            sv: 'Sök författare'
        })
        config.addLabel('Authors', {
            sv: 'Författare'
        })
        config.addLabel('Enter author', {
            sv: 'Ange författare'
        })
        config.addLabel('Add', {
            sv: 'Lägg till'
        })
        config.addLabel('Add new', {
            sv: 'Lägg till ny'
        })
        config.addLabel('First name', {
            sv: 'Förnamn'
        })
        config.addLabel('Last name', {
            sv: 'Efternamn'
        })
        config.addLabel('Phone', {
            sv: 'Telefon'
        })
        config.addLabel('Short description', {
            sv: 'Kort beskrivning'
        })
        config.addLabel('Long description', {
            sv: 'Lång beskrivning'
        })
        config.addLabel('ximauthor-error-save', {
            en: 'Error when saving author',
            sv: 'Fel vid sparande av författare'
        })
        config.addLabel('ximauthors-edit', {
            en: 'Edit',
            sv: 'Redigera'
        })
        config.addLabel('ximauthors-save', {
            en: 'Create',
            sv: 'Skapa'
        })
        config.addLabel('Save', {
            sv: 'Spara'
        })
        config.addLabel('Cancel', {
            sv: 'Ångra'
        })
        config.addLabel('ximauthors-invalid-url', {
            en: 'Invalid URL',
            sv: 'Ogiltig URL'
        })
        config.addLabel('ximauthors-error-internal', {
            en: 'Severe internal error creating concept',
            sv: 'Allvarligt internt fel vid skapande av concept'
        })
        config.addLabel('ximauthors-invalid-email', {
            en: 'Invalid email',
            sv: 'Ogiltig email'
        })
        config.addLabel('ximauthors-invalid-phone', {
            en: 'Invalid phone number',
            sv: 'Ogiltigt telefonnummer'
        })
        config.addLabel('ximauthors-error-save', {
            en: 'Error saving new author concept',
            sv: 'Fel vid spara nytt författare-concept'
        })
        config.addLabel('ximauthors-error-update', {
            en: 'Error updating author concept',
            sv: 'Fel vid uppdatering av författare-concept'
        })
        config.addValidator(AuthorValidation)
        config.addComponentToSidebarWithTabId(this.id, 'main', AuthorMainComponent)
    }
}
