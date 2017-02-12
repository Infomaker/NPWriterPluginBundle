import './style.scss'

import {registerPlugin} from 'writer'
import EventtrackerComponent from './EventtrackerComponent'

const eventtrackerPackage = {
    name: 'eventtracker',
    id: 'se.infomaker.eventtracker',
    configure: function(config) {

        config.addPopover(
            'eventtracker',
            {
                icon: 'fa-user',
                align: 'left'
            },
            EventtrackerComponent
        )
    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(eventtrackerPackage)
    } else {
        console.info("Register method not yet available");
    }
}
