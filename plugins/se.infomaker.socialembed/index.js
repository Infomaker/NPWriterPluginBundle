import './scss/socialembed.scss'

import SocialembedPackage from './SocialembedPackage'
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(SocialembedPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
