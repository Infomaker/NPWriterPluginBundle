import ArtilceOptionsPackage from "./ArticleOptionsPackage"
import {registerPlugin} from "writer"

(() => {
    if (registerPlugin) {
        registerPlugin(ArtilceOptionsPackage)
    } else {
        console.error("Register method not yet available");
    }
})()
