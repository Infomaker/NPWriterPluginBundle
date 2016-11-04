import XimteaserComponent from './XimteaserComponent'
import XimteaserConverter from './XimteaserConverter'
import Ximteaser from './Ximteaser'

export default {
    name: 'ximteaser',
    id: 'se.infomaker.ximteaser',
    configure: function (config) {
        config.addNode(Ximteaser)
        config.addComponent(Ximteaser.type, XimteaserComponent)
        config.addConverter('newsml', XimteaserConverter)

        config.addIcon('ximteaser', { 'fontawesome': ' fa-newspaper-o' })
    }
}