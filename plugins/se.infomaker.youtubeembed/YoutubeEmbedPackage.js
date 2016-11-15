import YoutubeEmbedTool from './YoutubeEmbedTool'
import YoutubeEmbedEditTool from './YoutubeEmbedEditTool'
import YoutubeEmbedCommand from './YoutubeEmbedCommand'
import YoutubeEmbedEditCommand from './YoutubeEmbedEditCommand'
import YoutubeEmbedNode from './YoutubeEmbedNode'
import YoutubeEmbedComponent from './YoutubeEmbedComponent'
import YoutubeEmbedConverter from './YoutubeEmbedConverter'

export default {
    id: 'se.infomaker.youtubeembed',
    name: 'youtubeembed',
    configure: function(config) {

        // Add tool
        config.addContentMenuTopTool('youtubeembed', YoutubeEmbedTool)
        config.addTool('youtubeembededit', YoutubeEmbedEditTool)

        config.addConverter('newsml', YoutubeEmbedConverter)

        // Add component
        config.addComponent('youtubeembed', YoutubeEmbedComponent)

        // Add Command
        config.addCommand('youtubeembed', YoutubeEmbedCommand)
        config.addCommand('youtubeembededit', YoutubeEmbedEditCommand)
        // Add node
        config.addNode(YoutubeEmbedNode)

        config.addLabel('insert-youtube-id', {
            en: 'Insert Youtube Id',
            sv: 'Infoga Youtube Id'
        })
    }
}