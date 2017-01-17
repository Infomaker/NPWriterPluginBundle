import ImageIntegrationPackage from './ImageIntegrationPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(ImageIntegrationPackage)
    } else {
        console.info("Register method not yet available");
    }
}


