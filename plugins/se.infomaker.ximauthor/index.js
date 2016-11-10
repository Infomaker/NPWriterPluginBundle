import AuthorPackage from './AuthorPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(AuthorPackage)
    } else {
        console.info("Register method not yet available");
    }
}


