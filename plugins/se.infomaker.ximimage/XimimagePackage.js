import XimimageComponent from './XimimageComponent'
import XimimageConverter from './XimimageConverter'
import Ximimage from './Ximimage'

export default {
    name: 'ximimage',
    id: 'se.infomaker.ximimage',
    configure: function (config) {
        config.addNode(Ximimage)
        config.addComponent(Ximimage.type, XimimageComponent)
        config.addConverter('newsml', XimimageConverter)

        config.addIcon('image', { 'fontawesome': 'fa-image' })
        config.addIcon('crop', { 'fontawesome': 'fa-crop' })
    }
}