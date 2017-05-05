import DefaultValidation from './DefaultValidation'
const {registerPlugin} = writer

const validationPackage = {
    id: 'se.infomaker.defaultvalidation',
    name: 'defaultvalidation',
    version: '{{version}}',
    configure: (config) => {

        config.addLabel('The first headline in the article should not be empty.', {
            sv: 'Artikelns översta rubrik borde inte vara tom.'
        })

        config.addLabel('The article is missing a headline which might make it hard to find.', {
            sv: 'Artikeln saknar rubrik.'
        })

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
