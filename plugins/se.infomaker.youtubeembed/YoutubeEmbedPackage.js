import './scss/youtubeembed.scss'
import './media/youtube-full.png'
import './media/youtube.png'
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
    metadata: {
        title: 'Youtube embed',
        description: `Easily embed video content from Youtube directly into your article. Add an embed by pasting or dropping an Youtube URL.
                       Support for editing the start time of the video.
                        Produces a <object type="x-im/youtube">`,
        organization: 'Infomaker Scandinavia AB',
        website: 'https://github.com/Infomaker/NPWriterPluginBundle/tree/master/plugins/se.infomaker.youtubeembed',
        tags: ['youtube', 'movie'],
        authors: [
            {
                name: "Andreas Kihlberg",
                email: "andreas.kihlberg@infomaker.se"
            }
        ],
        media: [
            {
                type: 'image',
                isAbsolutePath: false,
                path: 'media/youtube.png'
            },
            {
                type: 'image',
                isAbsolutePath: false,
                path: 'media/youtube-full.png'
            }
        ]
    },
    configure: function (config) {

        // Add tool
        config.addConverter('newsml', YoutubeEmbedConverter)

        // Add component
        config.addComponent('youtubeembed', YoutubeEmbedComponent)

        config.addValidator(YoutubeEmbedValidation)

        // Add Command
        config.addCommand('youtubeembed', YoutubeEmbedCommand)
        // Add node
        config.addNode(YoutubeEmbedNode)

        config.addDragAndDrop(DropUri)
        config.addMacro(YoutubeEmbedMacro)

    }
}