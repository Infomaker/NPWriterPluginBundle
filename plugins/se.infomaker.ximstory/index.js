import {registerPlugin} from 'writer'
import XimstoryPackage from './XimstoryPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(XimstoryPackage)
    } else {
        console.info("Register method not yet available");
    }
})()


