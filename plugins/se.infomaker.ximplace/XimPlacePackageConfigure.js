import LocationMainComponent from './LocationMainComponent'

export default (pluginId) => {

    return (config, pluginConfigObject) => {
        config.addComponentToSidebarWithTabId(pluginId, 'main', LocationMainComponent, pluginConfigObject)

        config.addLabel('Locations', {
            en: 'Locations',
            sv: 'Platser och områden'
        })
        config.addLabel('Areas', {
            en: 'Areas',
            sv: 'Län/Kommuner/Områden'
        })
        config.addLabel('Positions', {
            en: 'Positions',
            sv: 'Platser'
        })

        config.addLabel('Search locations', {
            en: 'Search locations',
            sv: 'Sök platser/områden'
        })

        config.addLabel('Search positions', {
            en: 'Search positions',
            sv: 'Sök platser'
        })

        config.addLabel('Search areas', {
            en: 'Search areas',
            sv: 'Sök områden'
        })

        config.addLabel('ximplace-error-save', {
            en: 'Error saving place: ',
            sv: 'Fel vid sparande av plats: '
        });
    }


}