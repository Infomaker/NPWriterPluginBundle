import {registerPlugin} from 'writer'
import headlinePackage from './HeadlinePackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(headlinePackage)
    } else {
        console.info("Register method not yet available");
    }
}