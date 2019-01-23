import {registerPlugin} from 'writer'
import UserBylinePackage from './UserBylinePackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(UserBylinePackage)
    } else {
        console.info('Register method not yet available')
    }
}
