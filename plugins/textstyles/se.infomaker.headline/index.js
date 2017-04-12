import {registerPlugin} from 'writer'
import headlinePackage from './HeadlinePackage'

(() => {
    if (registerPlugin) {
        registerPlugin(headlinePackage)
    } else {
        console.info("Register method not yet available");
    }
})()