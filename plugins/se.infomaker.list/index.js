import ListPackage from './ListPackage'
import { registerPlugin } from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(ListPackage)
    } else {
        console.info("Register method not yet available");
    }
}