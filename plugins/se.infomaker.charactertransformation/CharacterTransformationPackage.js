import CharacterTransformationMacro from './CharacterTransformationMacro'

export default {
    id: 'se.infomaker.charactertransformation',
    name: 'charactertransformation',
    version: '{{version}}',
    configure: function(config) {
        config.addMacro(CharacterTransformationMacro)
    }
}
