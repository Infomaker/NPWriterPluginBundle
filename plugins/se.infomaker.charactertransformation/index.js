import {registerPlugin} from 'writer'
import CharacterTransformationPackage from './CharacterTransformationPackage'

(() => {
    if (registerPlugin) {
        registerPlugin(CharacterTransformationPackage)
    } else {
        console.error("Register method not yet available");
    }
})()
