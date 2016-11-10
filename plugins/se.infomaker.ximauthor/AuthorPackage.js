import './scss/author.scss'
import AuthorMainComponent from './AuthorMainComponent'

export default {
    id: 'se.infomaker.ximauthor',
    name: 'ximauthor',
    configure: function (config) {
        config.addComponentToSidebarWithTabId(this.id, 'main', AuthorMainComponent)
    }
}
