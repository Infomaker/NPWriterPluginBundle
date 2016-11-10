import './scss/location.scss'
import LocationMainComponent from './LocationMainComponent'

export default {
    id: "se.infomaker.ximplace",
    name: "ximplace",
    configure: function(config) {
        config.addComponentToSidebarWithTabId(this.id, 'main', LocationMainComponent)
    }
}