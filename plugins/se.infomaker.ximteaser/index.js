import TeaserPackage from './TeaserPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(TeaserPackage)
    } else {
        console.info("Register method not yet available");
    }
}
