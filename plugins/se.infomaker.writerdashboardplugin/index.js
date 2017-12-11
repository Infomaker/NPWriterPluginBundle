import DevkitPackage from './DevKitPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(DevkitPackage)
    } else {
        console.error("Register method not yet available");
    }
}