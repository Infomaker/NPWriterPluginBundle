import XImPlacePackage from './XImPlacePackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(XImPlacePackage)
    } else {
        console.info("Register method not yet available");
    }
})()
