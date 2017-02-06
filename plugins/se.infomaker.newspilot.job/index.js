import JobPackage from './JobPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(JobPackage)
    } else {
        console.info("Register method not yet available");
    }
}


