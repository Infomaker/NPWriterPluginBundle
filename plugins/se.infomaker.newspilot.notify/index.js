import NewspilotNotifyPackage from './NewspilotNotifyPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(NewspilotNotifyPackage)
    } else {
        console.error("Register method not yet available");
    }
}