import FactBoxPackage from './FactBoxPackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(FactBoxPackage)
    } else {
        console.error("Register method not yet available");
    }
})()
