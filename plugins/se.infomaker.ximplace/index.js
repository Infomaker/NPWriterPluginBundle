import XImPlacePackage from './XImPlacePackage'
import XImPlacePackagePolygon from './XImPlacePackagePolygon'
import XImPlacePackagePosition from './XImPlacePackagePosition'
import {registerPlugin} from 'writer'

export default (placeType) => {
    if (registerPlugin) {

        switch (placeType) {

            case 'position':
                registerPlugin(XImPlacePackagePosition)
                break
            case 'polygon':
                registerPlugin(XImPlacePackagePolygon)
                break
            default:
                registerPlugin(XImPlacePackage)

        }

    } else {
        console.info("Register method not yet available");
    }
}
