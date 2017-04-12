import {registerPlugin} from 'writer'
import subheadlinePackage from './SubheadlinePackage'

(() => {
    if (registerPlugin) {
        registerPlugin(subheadlinePackage)
    } else {
        console.info("Register method not yet available");
    }
})()
