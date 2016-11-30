import './scss/youtubeembed.scss'

import YoutubeEmbedTool from './YoutubeEmbedTool'
import YoutubeEmbedCommand from './YoutubeEmbedCommand'
import YoutubeEmbedNode from './YoutubeEmbedNode'
import YoutubeEmbedComponent from './YoutubeEmbedComponent'
import YoutubeEmbedConverter from './YoutubeEmbedConverter'
import YoutubeEmbedMacro from './YoutubeEmbedMacro'

export default {
    id: 'se.infomaker.youtubeembed',
    name: 'youtubeembed',
    configure: function(config) {

        // Add tool
        config.addContentMenuTopTool('youtubeembed', YoutubeEmbedTool)

        config.addConverter('newsml', YoutubeEmbedConverter)

        // Add component
        config.addComponent('youtubeembed', YoutubeEmbedComponent)

        // Add Command
        config.addCommand('youtubeembed', YoutubeEmbedCommand)
        // Add node
        config.addNode(YoutubeEmbedNode)

        config.addMacro(YoutubeEmbedMacro)

        config.addLabel('insert-youtube-id', {
            en: 'Insert Youtube Id',
            sv: 'Infoga Youtube Id'
        })
    }
}