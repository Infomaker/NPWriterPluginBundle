import TablePackage from './TablePackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(TablePackage)
    } else {
        console.info("Register method not yet available");
    }
}
