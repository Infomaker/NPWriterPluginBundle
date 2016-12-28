import CategoryMainComponent from './CategoryMainComponent'
import './scss/category.scss'

export default {
    id: 'se.infomaker.ximcategory',
    name: 'ximcategory',

    configure: function(config) {
        config.addComponentToSidebarWithTabId(
            this.id,
            'main',
            CategoryMainComponent
        )
    }
}
