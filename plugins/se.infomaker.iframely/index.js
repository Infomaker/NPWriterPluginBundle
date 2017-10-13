import {registerPlugin} from 'writer'
import IframelyPackage from './IframelyPackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(IframelyPackage)
    } else {
        console.error("Register method not yet available");
    }
}
