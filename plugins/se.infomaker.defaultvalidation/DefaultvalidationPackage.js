import DefaultValidation from './DefaultValidation'
const {registerPlugin} = writer

const validationPackage = {
    id: 'se.infomaker.defaultvalidation',
    name: 'defaultvalidation',
    version: '{{version}}',
    configure: (config) => {
        config.addValidator(DefaultValidation)
    }
}



export default () => {
    if (registerPlugin) {
        registerPlugin(validationPackage)
    } else {
        console.info("Register method not yet available");
    }
}


