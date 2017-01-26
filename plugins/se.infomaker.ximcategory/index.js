import XimcategoryPackage from './XimcategoryPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(XimcategoryPackage)
    }
    else {
        console.info("Register method not yet available");
    }
}
