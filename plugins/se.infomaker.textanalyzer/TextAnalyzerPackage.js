import TextanalyzerComponent from './TextAnalyzerComponent'
import PluginInformation from './PluginInfomation'

export default {
    name: 'textanalyzer',
    id: 'se.infomaker.textanalyzer',
    version: '{{version}}',
    metadata: PluginInformation,
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
