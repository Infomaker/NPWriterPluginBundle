import './scss/preamble.scss'
import {registerPlugin} from 'writer'
import PreamblePackage from './PreamblePackage'

(() => {
    if (registerPlugin) {
        registerPlugin(PreamblePackage)
    } else {
        console.error("Could not register plugin");
    }
})()


