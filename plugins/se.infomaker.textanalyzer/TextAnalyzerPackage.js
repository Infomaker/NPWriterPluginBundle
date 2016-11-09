import TextanalyzerComponent from './TextAnalyzerComponent'

export default {
    name: 'textanalyzer',
    id: 'se.infomaker.textanalyzer',
    configure: function (config) {

        config.addLabel('hello', {
            en: "world",
            sv: "worldse"
        })
        config.addPopover(
            'textanalyzer',
            {
                icon: 'fa-line-chart',
                align: 'right',
                css: {
                    width: '30px',
                    height: '30px'
                }
            },
            TextanalyzerComponent
        )
        // config.addSidebarTab({id: 'textanalyzer', name: 'Textanalys'})
        // config.addComponentToSidebarTop(this.id, TextanalyzerComponent)
        // config.addComponentToSidebarWithTabId(this.id, 'textanalyzer', TextanalyzerComponent)
    }
}