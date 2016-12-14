import HistoryPackage from './HistoryPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(HistoryPackage)
    } else {
        console.info("Register method not yet available");
    }
}
