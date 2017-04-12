import './scss/publicationchannel.scss'

import {registerPlugin} from "writer"
import PublicationChannel from './Publicationchannel'

(() => {
    if (registerPlugin) {
        registerPlugin(PublicationChannel)
    } else {
        console.info("Register method not yet available");
    }
})()
