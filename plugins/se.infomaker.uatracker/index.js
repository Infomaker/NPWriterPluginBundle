import { registerPlugin } from 'writer'
import UATrackerpackage from './UATrackerPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(UATrackerpackage)
    } else {
        console.info("Register method not yet available");
    }
})()
