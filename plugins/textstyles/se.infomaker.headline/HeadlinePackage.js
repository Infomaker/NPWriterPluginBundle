import {registerPlugin} from 'writer'
import Headline from './Headline'
import HeadlineComponent from './HeadlineComponent'
import HeadlineConverter from './HeadlineConverter'

const headlinePackage = {
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
};

export default () => {
    if (registerPlugin) {
        registerPlugin(headlinePackage)
    } else {
        console.info("Register method not yet available");
    }
}

