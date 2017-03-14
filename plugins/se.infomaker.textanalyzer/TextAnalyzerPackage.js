import TextanalyzerComponent from './TextAnalyzerComponent'
import PluginInformation from './PluginInfomation'

export default {
    name: 'textanalyzer',
    id: 'se.infomaker.textanalyzer',
<<<<<<< HEAD
    version: '{{version}}',
    metadata: PluginInformation,
=======
    index: 5000,
    version: '{{version}}',
>>>>>>> develop
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
