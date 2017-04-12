import './scss/dateline.scss'
import {registerPlugin} from 'writer'
import DatelinePackage from './DatelinePackage'

(() => {
    if (registerPlugin) {
        registerPlugin(DatelinePackage)
    } else {
        console.error("Could not register plugin");
    }
})()


