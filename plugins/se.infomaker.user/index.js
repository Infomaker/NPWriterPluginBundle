import {registerPlugin} from 'writer'
import UserPackage from './UserPackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(UserPackage)
    } else {
        console.info('Register method not yet available')
    }
}
