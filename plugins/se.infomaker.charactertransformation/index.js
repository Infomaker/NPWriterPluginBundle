import {registerPlugin} from 'writer'
import CharacterTransformationPackage from './CharacterTransformationPackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(CharacterTransformationPackage)
    } else {
        console.error("Register method not yet available");
    }
}
