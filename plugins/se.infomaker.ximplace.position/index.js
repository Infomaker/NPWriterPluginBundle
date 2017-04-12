import XImPlacePackagePosition from '../se.infomaker.ximplace/XImPlacePackagePosition'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(XImPlacePackagePosition)
    } else {
        console.info("Register method not yet available");
    }
})()
