import FactBoxPackage from './FactBoxPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(FactBoxPackage)
    } else {
        console.error("Register method not yet available");
    }
}
