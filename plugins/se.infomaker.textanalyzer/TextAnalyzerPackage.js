import TextanalyzerComponent from './TextAnalyzerComponent'

export default {
    name: 'textanalyzer',
    id: 'se.infomaker.textanalyzer',
    configure: function (config) {

        config.addSidebarTab({id: 'textanalyzer', name: 'Textanalys'})
        // config.addComponentToSidebarTop(this.id, TextanalyzerComponent)
        config.addComponentToSidebarWithTabId(this.id, 'textanalyzer', TextanalyzerComponent)
    }
}