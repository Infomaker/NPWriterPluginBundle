import './scss/factbody.scss'
import {registerPlugin} from 'writer'
import FactbodyPackage from './FactbodyPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(FactbodyPackage)
    } else {
        console.error("Could not register plugin");
    }
})()


