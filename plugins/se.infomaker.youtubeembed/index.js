import {registerPlugin} from 'writer'
import YoutubeEmbedPackage from './YoutubeEmbedPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(YoutubeEmbedPackage)
    } else {
        console.error("Register method not yet available");
    }
})()