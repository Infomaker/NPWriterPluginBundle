import DefaultValidation from './DefaultValidation'

export default {
    id: 'se.infomaker.defaultvalidation',
    name: 'defaultvalidation',
    configure: (config) => {
        config.addValidator(DefaultValidation)
    }
}




