import CharacterTransformationMacro from './CharacterTransformationMacro'

export default {
    id: 'se.infomaker.charactertransformation',
    name: 'charactertransformation',
    configure: function(config) {
        config.addMacro(CharacterTransformationMacro)
    }
}
