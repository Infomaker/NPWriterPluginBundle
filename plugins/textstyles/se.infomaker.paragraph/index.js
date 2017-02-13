import {registerPlugin} from 'writer'
import ParagraphPackage from './ParagraphPackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(ParagraphPackage)
    } else {
        console.info("Register method not yet available");
    }
}

