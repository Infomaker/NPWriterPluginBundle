import LocationMainComponent from './LocationMainComponent'

export default () => {

    return (config, pluginConfig) => {
        config.addToSidebar('main', pluginConfig, LocationMainComponent)

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
            en: 'Error saving place',
            sv: 'Fel vid sparande av plats'
        });
        config.addLabel('Place', {
            en: 'Place',
            sv: 'Plats'
        });
        config.addLabel('Edit of polygons is not currently supported', {
            en: 'Edit of polygons is not currently supported',
            sv: 'Redigering av polygoner är för närvarande inte möjlig'
        });
    }
}
