import CategoryMainComponent from './CategoryMainComponent'
import './scss/category.scss'

export default {
    id: 'se.infomaker.ximcategory',
    name: 'ximcategory',
    version: '{{version}}',
    configure: function(config) {
        config.addComponentToSidebarWithTabId(
            this.id,
            'main',
            CategoryMainComponent
        )

        config.addLabel('Categories', {
            sv: 'Kategorier'
        })

        config.addLabel('Name', {
            sv: 'Namn'
        })

        config.addLabel('Short description', {
            sv: 'Kort beskrivning'
        })

        config.addLabel('Long description', {
            sv: 'Lång beskrivning'
        })

        config.addLabel('Search categories', {
            sv: 'Sök kategorier'
        })

        config.addLabel('Remove from article', {
            sv: 'Ta bort från artikel'
        })
    }
}
