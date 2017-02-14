import Headline from './Headline'
import HeadlineComponent from './HeadlineComponent'
import HeadlineConverter from './HeadlineConverter'

export default {
    id: 'se.infomaker.headline',
    name: 'headline',
    configure: function (config) {
        config.addNode(Headline)
        config.addComponent(Headline.type, HeadlineComponent)
        config.addConverter('newsml', HeadlineConverter)
        config.addTextType({
            name: 'headline',
            data: {type: 'headline'}
        })

        const headlineLbl = {
            en: 'Headline',
            de: 'Headline',
            sv: 'Rubrik'
        }
        config.addLabel('headline.content', headlineLbl)
        config.addLabel('headline', headlineLbl)

    }
}


