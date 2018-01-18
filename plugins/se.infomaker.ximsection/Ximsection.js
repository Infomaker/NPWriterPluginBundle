import XimsectionComponent from './XimsectionComponent'

export default {
    id: 'se.infomaker.ximsection',
    name: 'ximsection',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addLabel('ximsection-Sections', {
            en: 'Section',
            sv: 'Avdelning'
        })

        config.addLabel('ximsection-Choose_section', {
            en: 'Choose Section',
            sv: 'Välj Avdelning'
        })

        config.addToSidebar('main', pluginConfig, XimsectionComponent)
    }
}

