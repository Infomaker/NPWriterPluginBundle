import './scss/tags.scss'

import {registerPlugin} from "writer"
import TagsPackage from './TagsPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(TagsPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
