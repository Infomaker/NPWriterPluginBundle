import {registerPlugin} from 'writer'
import HeaderEditorPackage from './HeaderEditorPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(HeaderEditorPackage)
    } else {
        console.info("Register method not yet available");
    }
})()
