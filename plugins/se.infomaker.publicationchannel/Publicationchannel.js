import PublicationChannelComponent from './PublicationchannelComponent'

export default {
    id: 'se.infomaker.publicationchannel',
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

        config.addLabel('Please choose main publication channel before sharing with other channels', {
            en: 'Please choose main publication channel before sharing with other channels',
            sv: 'Vänligen välj huvudkanal innan delning med andra kanaler'
        })

        config.addComponentToSidebarWithTabId('publicationchannel', 'main', PublicationChannelComponent)
    }
}
