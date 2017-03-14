import SocialembedComponent from './SocialembedComponent'
import SocialembedCommand from './SocialembedCommand'
import SocialembedConverter from './SocialembedConverter'
import SocialembedMacro from './SocialembedMacro'
import SocialembedNode from './SocialembedNode'
import DropSocialEmbed from './DropSocialEmbed'

export default {
    name: 'socialembed',
    id: 'se.infomaker.socialembed',
    version: '{{version}}',
    configure: function (config) {
        config.addNode(SocialembedNode)
        config.addCommand('socialembed', SocialembedCommand)
        config.addComponent(SocialembedNode.type, SocialembedComponent)
        config.addConverter('newsml', SocialembedConverter)
        config.addMacro(SocialembedMacro)
        config.addDragAndDrop(DropSocialEmbed)
    }
}
