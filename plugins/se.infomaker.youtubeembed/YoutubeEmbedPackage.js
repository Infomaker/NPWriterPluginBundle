import './scss/youtubeembed.scss'

import YoutubeEmbedCommand from './YoutubeEmbedCommand'
import YoutubeEmbedNode from './YoutubeEmbedNode'
import YoutubeEmbedComponent from './YoutubeEmbedComponent'
import YoutubeEmbedConverter from './YoutubeEmbedConverter'
import YoutubeEmbedMacro from './YoutubeEmbedMacro'
import YoutubeEmbedValidation from './YoutubeEmbedValidation'
import DropUri from './DropUri'

export default {
    id: 'se.infomaker.youtubeembed',
    name: 'youtubeembed',
    version: '{{version}}',
    configure: function(config) {

        // Add tool
        config.addConverter(YoutubeEmbedConverter)

        // Add component
        config.addComponent('youtubeembed', YoutubeEmbedComponent)

        config.addValidator(YoutubeEmbedValidation)

        // Add Command
        config.addCommand('youtubeembed', YoutubeEmbedCommand)
        // Add node
        config.addNode(YoutubeEmbedNode)

        config.addDropHandler(new DropUri())
        config.addMacro(YoutubeEmbedMacro)

    }
}
