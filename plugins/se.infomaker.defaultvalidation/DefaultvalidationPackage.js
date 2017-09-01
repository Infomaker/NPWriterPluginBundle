import DefaultValidation from './DefaultValidation'
const {registerPlugin, Hook, api} = writer

class TestHook {
    execute() {
        debugger
        console.log(`hello`)
    }
}

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

        config.addLabel('Looks like the first headline is not correct.', {
            sv: 'Det ser ut som om översta rubriken inte är korrekt.'
        })

        config.addLabel('The article must have a least one publication channel.', {
            sv: 'Artikeln måste ha minst en publiceringskanal.'
        })

        config.addLabel('Main channel is missing.', {
            sv: 'Artikeln saknar huvudkanal.'
        })

        config.addLabel('At least one category must be chosen.', {
            sv: 'Minst en kategori måste väljas.'
        })

        config.addValidator(DefaultValidation)
        config.addHook('before:save', TestHook)
    }
}



export default () => {
    if (registerPlugin) {
        registerPlugin(validationPackage)
    } else {
        console.info("Register method not yet available");
    }
}
