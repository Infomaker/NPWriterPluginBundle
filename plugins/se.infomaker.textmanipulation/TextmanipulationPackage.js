import {TextmanipulationComponent} from './TextmanipulationComponent'

const TextmanipulationPackage = {
    name: 'textmanipulation',
    id: 'se.infomaker.textmanipulation',
    index: 5000,
    version: '{{version}}',
    configure: function (config) {

        config.addLabel('Search for', {
            sv: 'Sök efter'
        })

        config.addLabel('Replace with', {
            sv: 'Ersätt med'
        })

        config.addLabel('Find next', {
            sv: 'Sök nästa'
        })

        config.addLabel('Replace', {
            sv: 'Ersätt'
        })

        config.addLabel('Match whole words', {
            sv: 'Endast hela ord'
        })

        config.addLabel('Case sensitive', {
            sv: 'Matcha gemener/VERSALER'
        })

        config.addPopover(
            'textmanipulation',
            {
                icon: 'fa-search',
                align: 'right',
                sticky: false
            },
            TextmanipulationComponent
        )
    }
}

export {TextmanipulationPackage}
