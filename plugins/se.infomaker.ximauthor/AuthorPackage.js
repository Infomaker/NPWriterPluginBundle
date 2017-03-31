import './scss/author.scss'
import './scss/_authorinfo.scss'
import './media/author.png'
import './media/author2.png'
import './media/author3.png'

import AuthorMainComponent from './AuthorMainComponent'
import AuthorValidation from './AuthorValidation'
import PluginInformation from './PluginInformation'

export default {
    id: 'se.infomaker.ximauthor',
    name: 'ximauthor',
    version: '{{version}}',
    metadata: PluginInformation,
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
        config.addValidator(AuthorValidation)
        config.addComponentToSidebarWithTabId(this.id, 'main', AuthorMainComponent)
    }
}
