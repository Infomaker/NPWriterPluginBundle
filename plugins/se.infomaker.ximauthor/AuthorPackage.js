import './scss/author.scss'
import './scss/_authorinfo.scss'
import AuthorMainComponent from './AuthorMainComponent'
import AuthorValidation from './AuthorValidation'

export default {
    id: 'se.infomaker.ximauthor',
    name: 'ximauthor',
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
        config.addValidator(AuthorValidation)
        config.addComponentToSidebarWithTabId(this.id, 'main', AuthorMainComponent)
    }
}
