import ContentprofilePackage from './ContentprofilePackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(ContentprofilePackage)
    } else {
        console.info("Register method not yet available");
    }
})()
