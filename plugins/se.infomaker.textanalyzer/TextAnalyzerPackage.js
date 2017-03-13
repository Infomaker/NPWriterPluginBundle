import TextanalyzerComponent from './TextAnalyzerComponent'

export default {
    name: 'textanalyzer',
    id: 'se.infomaker.textanalyzer',
    index: 5000,
    version: '{{version}}',
    configure: function (config) {

        config.addLabel('Characters', {
            sv: "Antal tecken"
        })

        config.addLabel('Words', {
            sv: "Antal ord"
        })

        config.addPopover(
            'textanalyzer',
            {
                icon: 'fa-info',
                align: 'right',
                sticky: true
            },
            TextanalyzerComponent
        )
    }
}
