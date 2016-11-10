import XImPlacePackage from './XImPlacePackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(XImPlacePackage)
    } else {
        console.info("Register method not yet available");
    }
}
