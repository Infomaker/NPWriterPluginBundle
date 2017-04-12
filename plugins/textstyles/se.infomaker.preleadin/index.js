import './scss/preleadin.scss'
import {registerPlugin} from 'writer'
import PreleadinPackage from './PreleadinPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(PreleadinPackage)
    } else {
        console.error("Could not register plugin");
    }
})()