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

        config.addLabel('youtube-embed-failed-title', {
            en: 'Loading Error',
            sv: 'Inladdningsfel'
        })

        config.addLabel('youtube-embed-could-not-load', {
            en: 'Could not load YouTube Embed information. The creator might not allow embedding of video.',
            sv: 'Kunde inte ladda YouTube Embed. Skaparen kanske inte tillåter inbäddning av videon.'
        })

    }
}
