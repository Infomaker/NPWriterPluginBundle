import HistoryPackage from './HistoryPackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(HistoryPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
