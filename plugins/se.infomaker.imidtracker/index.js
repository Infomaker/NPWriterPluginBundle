'use strict'

import {registerPlugin} from 'writer'
import IMIDTrackerpackage from './IMIDTrackerPackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(IMIDTrackerpackage)
    } else {
        console.info("Register method not yet available");
    }
}
