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

        config.addLabel('Click link to view content', {
            sv: 'Klicka för att visa innehåll'
        })

        config.addNode(SocialembedNode)
        config.addCommand('socialembed', SocialembedCommand)
        config.addComponent(SocialembedNode.type, SocialembedComponent)
        config.addConverter(SocialembedConverter)
        config.addMacro(SocialembedMacro)
        config.addDropHandler(new DropSocialEmbed())

    }
}
