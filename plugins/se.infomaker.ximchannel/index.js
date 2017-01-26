import XimchannelPackage from './XimchannelPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(XimchannelPackage)
    }
    else {
        console.info("Register method not yet available");
    }
}
