import {registerPlugin} from 'writer'
import Subheadline from './Subheadline'
import SubheadlineComponent from './SubheadlineComponent'
import SubheadlineConverter from './SubheadlineConverter'

const subheadlinePackage = {
    id: 'se.infomaker.subheadline',
    name: 'subheadline',
    version: '{{version}}',
    configure: function(config) {
        config.addNode(Subheadline)
        config.addComponent(Subheadline.type, SubheadlineComponent)
        config.addConverter('newsml', SubheadlineConverter)
        config.addTextType({
            name: 'subheadline',
            data: {type: 'subheadline'}
        })

        config.addLabel('subheadline', {
            en: 'Subheadline',
            de: 'Subheadline',
            sv: 'Underrubrik'
        })

        config.addLabel('subheadline.content', {
            en: 'Subheadline',
            de: 'Subheadline',
            sv: 'Underrubrikrik'
        })

        config.addLabel('subheadline.short', {
            en: 'H2',
            de: 'H2',
            sv: 'UR'
        })
    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(subheadlinePackage)
    } else {
        console.info("Register method not yet available");
    }
}
