import './style.scss'

import {registerPlugin} from 'writer'
import EventtrackerComponent from './EventtrackerComponent'

const eventtrackerPackage = {
    name: 'eventtracker',
    id: 'se.infomaker.eventtracker',
    configure: function(config) {

        config.addComponentToSidebarWithTabId(this.id, 'main', EventtrackerComponent)

    }
}

export default () => {
    console.log("RUB!");
    if (registerPlugin) {
        registerPlugin(eventtrackerPackage)
    } else {
        console.info("Register method not yet available");
    }
}
