import registerPlugin from 'writer'
import validationPackage from './DefaultvalidationPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(validationPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
