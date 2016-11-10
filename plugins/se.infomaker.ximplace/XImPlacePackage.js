import './scss/location.scss'
import LocationMainComponent from './LocationMainComponent'

export default {
    id: "se.infomaker.ximplace",
    name: "ximplace",
    index: 10,
    configure: function(config) {
        config.addComponentToSidebarWithTabId(this.id, 'main', LocationMainComponent)
    }
}