import Headline from './validators/Headline'
import Preamble from './validators/Preamble'
import MainChannel from './validators/MainChannel'
import Tags from './validators/Tags'
import Authors from './validators/Authors'
import Categories from './validators/Categories'
import Review from './validators/Review'
import Fact from './validators/Fact'

const {registerPlugin} = writer

const validationPackage = {
    id: 'se.infomaker.slm.validation',
    name: 'slmvalidation',
    version: '{{version}}',
    configure: (config) => {

        /**
         * Headline
         */
        config.addLabel('validator-headline-empty', {
            en: 'The headline in the article should not be empty.',
            sv: 'Artikelns rubrik borde inte vara tom.'
        })

        config.addLabel('validator-headline-missing', {
            en: 'The article is missing a headline which might make it hard to find.',
            sv: 'Artikeln saknar rubrik.'
        })

        config.addLabel('validator-headline-too-many', {
            en: 'Only one headline per article is allowed.',
            sv: 'Endast en rubrik är tillåten per artikel.'
        })

        /**
         * Preamble
         */
        config.addLabel('validator-preamble-missing', {
            en: 'The article needs at least one preamble.',
            sv: 'Artikeln måste innehålla minst en ingress.'
        })

        /**
         * Main channel
         */
        config.addLabel('validator-main-channel-missing', {
            en: 'Main channel is missing.',
            sv: 'Artikeln saknar huvudkanal.'
        })

        /**
         * Tags
         */
        config.addLabel('validator-tags-missing', {
            en: 'The article must contain at least one tag.',
            sv: 'Artikeln måste innehålla minst en tag.'
        })

        /**
         * Author
         */
        config.addLabel('validator-author-missing', {
            en: 'The article must contain at least one author.',
            sv: 'Artikeln måste innehålla minst en författare.'
        })

        /**
         * Categories
         */
        config.addLabel('validator-category-missing', {
            en: 'The article must contain at least one category.',
            sv: 'Artikeln måste innehålla minst en kategori.'
        })

        /**
         * Review
         */
        config.addLabel('validator-review-grade-incorrect', {
            en: 'Review grade must be between 0 and 5.',
            sv: 'Recensionsbetyget måste vara mellan 0 och 5.'
        })

        config.addLabel('validator-review-too-many', {
            en: 'Only one review per article is allowed.',
            sv: 'Endast en recension är tillåten per artikel.'
        })

        /**
         * Fact
         */
        config.addLabel('validator-fact-too-many', {
            en: 'Only one fact per article is allowed.',
            sv: 'Endast en faktaruta är tillåten per artikel.'
        })

        config.addValidator(Headline)
        config.addValidator(Preamble)
        config.addValidator(MainChannel)
        config.addValidator(Tags)
        config.addValidator(Authors)
        config.addValidator(Categories)
        config.addValidator(Review)
        config.addValidator(Fact)
    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(validationPackage)
    } else {
        console.info("Register method not yet available");
    }
}
