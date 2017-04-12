import XimcategoryPackage from './XimcategoryPackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(XimcategoryPackage)
    }
    else {
        console.info("Register method not yet available");
    }
})()
