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

        config.addLabel('next', {
            sv: 'Nästa',
            en: 'Next'
        })

        config.addLabel('prev', {
            sv: 'Föregående',
            en: 'Prev'
        })

        config.addLabel('Replace', {
            sv: 'Ersätt'
        })

        config.addLabel('Replace all', {
            sv: 'Ersätt alla'
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
