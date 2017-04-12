import './scss/contentrelations.scss'

import ContentRelationsPckage from './ContentrelationsPackage'
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(ContentRelationsPckage)
    } else {
        console.info("Register method not yet available");
    }
})()
