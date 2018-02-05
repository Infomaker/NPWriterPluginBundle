import { registerPlugin } from 'writer'
import LinkPackage from './LinkPackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(LinkPackage)
    }
    else {
        console.error('Register method not yet available')
    }
}
