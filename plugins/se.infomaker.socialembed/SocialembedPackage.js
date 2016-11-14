import SocialembedComponent from './SocialembedComponent'
import SocialembedCommand from './SocialembedCommand'
import SocialembedConverter from './SocialembedConverter'
import SocialembedMacro from './SocialembedMacro'
import Socialembed from './Socialembed'

export default {
    name: 'socialembed',
    id: 'se.infomaker.socialembed',
    configure: function (config) {
        config.addNode(Socialembed)
        config.addCommand('socialembed', SocialembedCommand)
        config.addComponent(Socialembed.type, SocialembedComponent)
        config.addConverter('newsml', SocialembedConverter)
        config.addMacro(SocialembedMacro)
        config.addDragAndDrop(DropSocialEmbed)
    }
}