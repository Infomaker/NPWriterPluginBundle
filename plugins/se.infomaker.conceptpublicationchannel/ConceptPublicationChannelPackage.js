import PublicationChannelComponent from './components/PublicationChannelComponent'
import './scss/main.scss'

const XimConceptPackage = {

    id: 'se.infomaker.conceptpublicationchannel',
    name: 'conceptpublicationchannel',
    version: '{{version}}',
    configure(configurator, pluginConfig) {

        configurator.addToSidebar('main', pluginConfig, PublicationChannelComponent)

        configurator.addLabel('Publication channels', {
            sv: 'Publiceringskanaler'
        })
        configurator.addLabel('No channels found', {
            sv: 'Hittade inga kanaler'
        })
        configurator.addLabel('Set main channel', {
            sv: 'Välj huvudkanal'
        })
        configurator.addLabel('Shared with', {
            sv: 'Delas med'
        })
        configurator.addLabel('You have to set a main channel', {
            sv: 'Du måste välja en huvudkanal'
        })
        configurator.addLabel('Select all', {
            sv: 'Välj alla'
        })
        configurator.addLabel('Clear all', {
            sv: 'Rensa'
        })
        configurator.addLabel('ok', {
            sv: 'Ok'
        })
        configurator.addLabel('cancel', {
            sv: 'Avbryt'
        })
        configurator.addLabel('Related concepts might be affected', {
            sv: 'Relaterade koncept kan komma att påverkas'
        })
        configurator.addLabel('There are concepts associated with the one you removed, do you wish to remove the following concepts as well', {
            sv: 'Det finns koncept som är relaterade till den du just tog bort, vill du även ta bort följande koncept'
        })
    }
}

export default XimConceptPackage