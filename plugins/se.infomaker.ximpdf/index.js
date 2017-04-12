import './scss/ximpdf.scss'

import XimpdfPackage from './XimpdfPackage'
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(XimpdfPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
