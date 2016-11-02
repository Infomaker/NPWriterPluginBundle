import XimteaserComponent from './XimteaserComponent'
// import XimteaserCommand from './XimteaserCommand'
import XimteaserConverter from './XimteaserConverter'
import Ximteaser from './Ximteaser'

// const { Tool } = substance

export default {
    name: 'ximteaser',
    id: 'se.infomaker.ximteaser',
    configure: function (config) {
        config.addNode(Ximteaser)
        // config.addCommand('ximteaser', XimteaserCommand)
        config.addComponent(Ximteaser.type, XimteaserComponent)
        config.addConverter('newsml', XimteaserConverter)

        // config.addTool('ximteaser', Tool, {
        //     toolGroup: 'content-menu'
        // })

        config.addIcon('ximteaser', { 'fontawesome': ' fa-newspaper-o' })
        config.addIcon('upload', { 'fontawesome': 'fa-upload' })
        config.addIcon('crop', { 'fontawesome': 'fa-crop' })
    }
}