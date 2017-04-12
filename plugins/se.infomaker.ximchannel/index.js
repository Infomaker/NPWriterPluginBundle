import XimchannelPackage from './XimchannelPackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(XimchannelPackage)
    }
    else {
        console.info("Register method not yet available");
    }
})()
