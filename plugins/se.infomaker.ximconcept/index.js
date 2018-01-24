import XimConceptPackage from './XimConceptPackage'
import { registerPlugin } from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(XimConceptPackage)
    }
    else {
        console.info("Register method not yet available");
    }
}