import JobPackage from './JobPackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(JobPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
