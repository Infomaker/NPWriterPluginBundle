import './scss/drophead.scss'
import DropheadPackage from './DropheadPackage'
import {registerPlugin} from 'writer'

(() => {
    if (registerPlugin) {
        registerPlugin(DropheadPackage)
    } else {
        console.error("Could not register plugin");
    }
})()


