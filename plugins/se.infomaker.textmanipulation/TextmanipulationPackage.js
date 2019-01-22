import {TextmanipulationComponent} from './TextmanipulationComponent'

const TextmanipulationPackage = {
    name: 'textmanipulation',
    id: 'se.infomaker.textmanipulation',
    index: 5000,
    version: '{{version}}',
    configure: function (configurator) {

        configurator.addLabel('Search and replace', {
            sv: 'Sök och ersätt'
        })

        configurator.addLabel('Search for', {
            sv: 'Sök efter'
        })

        configurator.addLabel('Replace with', {
            sv: 'Ersätt med'
        })

        configurator.addLabel('next', {
            sv: 'Nästa',
            en: 'Next'
        })

        configurator.addLabel('prev', {
            sv: 'Föregående',
            en: 'Prev'
        })

        configurator.addLabel('Replace', {
            sv: 'Ersätt'
        })

        configurator.addLabel('Replace all', {
            sv: 'Ersätt alla'
        })

        configurator.addLabel('Match whole words', {
            sv: 'Endast hela ord'
        })

        configurator.addLabel('Case sensitive', {
            sv: 'Matcha gemener/VERSALER'
        })

        configurator.addLabel('No hits', {
            sv: 'Inga träffar'
        })

        configurator.addLabel('Replaced', {
            sv: 'Ersatte'
        })

        configurator.addLabel('Occurrences', {
            sv: 'Förekomster'
        })

        configurator.addPopover(
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
