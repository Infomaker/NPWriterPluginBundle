import ContentPartPackage from './ContentPartPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(ContentPartPackage)
    } else {
        console.error("Register method not yet available");
    }
}
