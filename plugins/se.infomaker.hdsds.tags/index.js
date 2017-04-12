import './scss/tags.scss'

import TagsPackage from './TagsPackage'
import registerPlugin from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(TagsPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
