import DefaultValidation from './DefaultValidation'

export default {
    id: 'se.infomaker.defaultvalidation',
    name: 'defaultvalidation',
    version: '{{version}}',
    configure: (config) => {
        config.addValidator(DefaultValidation)
    }
}




