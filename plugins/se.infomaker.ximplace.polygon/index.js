import XImPlacePackagePolygon from '../se.infomaker.ximplace/XImPlacePackagePolygon'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(XImPlacePackagePolygon)
    } else {
        console.info("Register method not yet available");
    }
})()