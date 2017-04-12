import {registerPlugin} from 'writer'
import ParagraphPackage from './ParagraphPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(ParagraphPackage)
    } else {
        console.info("Register method not yet available");
    }
})()

