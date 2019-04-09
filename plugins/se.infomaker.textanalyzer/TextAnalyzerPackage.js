import TextanalyzerComponent from './TextAnalyzerComponent'
import { labels } from './Labels'

export default {
    name: 'textanalyzer',
    id: 'se.infomaker.textanalyzer',
    index: 5000,
    version: '{{version}}',
    configure: function (config) {

        Object.keys(labels).forEach(label => {
            config.addLabel(label, labels[label])
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
