import './scss/madmansrow.scss'
import {registerPlugin} from 'writer'
import MadmansrowPackage from './MadmansrowPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(MadmansrowPackage)
    } else {
        console.error("Could not register plugin");
    }
})()


