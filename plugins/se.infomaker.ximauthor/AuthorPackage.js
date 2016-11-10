import './scss/author.scss'
import AuthorMainComponent from './AuthorMainComponent'

export default {
    id: 'se.infomaker.ximauthor',
    name: 'ximauthor',
    index: 150,
    configure: function (config) {
        config.addComponentToSidebarWithTabId(this.id, 'main', AuthorMainComponent)
    }
}
