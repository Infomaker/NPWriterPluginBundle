import PublicationChannelMainComponent from './components/PublicationChannelMainComponent'
import './scss/main.scss'

const XimConceptPackage = {

    id: 'se.infomaker.conceptpublicationchannel',
    name: 'conceptpublicationchannel',
    version: '{{version}}',
    configure(configurator, pluginConfig) {

        configurator.addToSidebar('main', pluginConfig, PublicationChannelMainComponent)

        configurator.addLabel('publication-channel-title', {
            sv: 'Publiceringskanaler',
            en: 'Publication channels'
        })
        configurator.addLabel('publication-no-channels-found', {
            sv: 'Hittade inga kanaler',
            en: 'No channels found'
        })
        configurator.addLabel('publication-main-channel', {
            sv: 'Publiceringskanaler',
            en: 'Main channel'
        })
        configurator.addLabel('publication-main-channel-label', {
            sv: 'Välj huvudkanal',
            en: 'Set main channel'
        })
        configurator.addLabel('publication-secondary-channels', {
            sv: 'Delas med',
            en: 'Shared with'
        })
        configurator.addLabel('publication-set-main-channel', {
            sv: 'Du måste välja en huvudkanal',
            en: 'You have to set a main channel'
        })
        configurator.addLabel('publication-select-all', {
            sv: 'Välj alla',
            en: 'Select all'
        })
        configurator.addLabel('publication-remove-all', {
            sv: 'Rensa',
            en: 'Clear all'
        })
    }
}

export default XimConceptPackage