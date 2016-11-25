import PublicationChannelComponent from './PublicationchannelComponent'
function Publicationchannel() {}

export default {
    id: 'se.infomaker.mitm.publicationchannel',
    name: 'publicationchannel',

    configure: function(config) {

        config.addLabel('publicationchannel-Channels', {
            en: 'Channels',
            sv: 'Publiceringskanaler'
        })

        config.addLabel('publicationchannel-Shared_with', {
            en: 'Shared with',
            sv: 'Delas med'
        })

        config.addLabel('publicationchannel-Choose_all', {
            en: 'Choose all',
            sv: 'Välj alla'
        })

        config.addLabel('publicationchannel-Choose_main_channel', {
            en: 'Choose main channel',
            sv: 'Välj huvudkanal'
        })

        config.addLabel('publicationchannel-mainChannel-warning', {
            en: 'Please choose main publication channel before sharing with other channels',
            sv: 'Vänligen välj huvudkanal innan delning med andra kanaler'
        })

        config.addComponentToSidebarWithTabId('publicationchannel', 'main', PublicationChannelComponent)
    }
}

