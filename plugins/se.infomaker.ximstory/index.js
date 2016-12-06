import XimstoryPackage from './XimstoryPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(XimstoryPackage)
    } else {
        console.info("Register method not yet available");
    }
}


