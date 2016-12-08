import ContentprofilePackage from './ContentprofilePackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(ContentprofilePackage)
    } else {
        console.info("Register method not yet available");
    }
}


