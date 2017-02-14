import {registerPlugin} from 'writer'
import blockquotePackage from './BlockquotePackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(blockquotePackage)
    } else {
        console.info("Register method not yet available");
    }
}