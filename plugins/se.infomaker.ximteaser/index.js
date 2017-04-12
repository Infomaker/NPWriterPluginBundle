import './scss/ximteaser.scss'
import {registerPlugin} from 'writer'
import XimteaserPackage from './XimteaserPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(XimteaserPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
