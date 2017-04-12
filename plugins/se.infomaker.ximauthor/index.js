import AuthorPackage from './AuthorPackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(AuthorPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
