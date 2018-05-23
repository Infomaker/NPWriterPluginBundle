import {TextmanipulationComponent} from './TextmanipulationComponent'

const TextmanipulationPackage = {
    name: 'textmanipulation',
    id: 'se.infomaker.textmanipulation',
    index: 5000,
    version: '{{version}}',
    configure: function (config) {

        config.addLabel('Characters', {
            sv: 'Antal tecken'
        })

        config.addLabel('Words', {
            sv: 'Antal ord'
        })

        config.addLabel('Source', {
            sv: 'Källa'
        })

        config.addLabel('No source found', {
            sv: 'Ingen källa'
        })

        config.addLabel('Created', {
            sv: 'Skapad'
        })

        config.addLabel('Updated', {
            sv: 'Uppdaterad'
        })

        config.addPopover(
            'textmanipulation',
            {
                icon: 'fa-search',
                align: 'right',
                sticky: true
            },
            TextmanipulationComponent
        )
    }
}

export {TextmanipulationPackage}
