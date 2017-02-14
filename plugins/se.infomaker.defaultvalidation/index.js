import registerPlugin from 'writer'
import validationPackage from './DefaultvalidationPackage'
export default () => {
    if (registerPlugin) {
        registerPlugin(validationPackage)
    } else {
        console.info("Register method not yet available");
    }
}
