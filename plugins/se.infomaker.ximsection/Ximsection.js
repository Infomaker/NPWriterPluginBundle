import XimsectionComponent from './XimsectionComponent'

export default {
    id: 'se.infomaker.ximsection',
    name: 'ximsection',

    configure: function (config) {

        config.addLabel('ximsection-Sections', {
            en: 'Sections',
            sv: 'Avdelningar'
        })

        config.addLabel('ximsection-Choose_section', {
            en: 'Choose Section',
            sv: 'Välj Avdelning'
        })

        config.addComponentToSidebarWithTabId('ximsection', 'main', XimsectionComponent)
    }
}

