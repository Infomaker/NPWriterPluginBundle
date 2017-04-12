import './scss/newspriority.scss'
import NewsPriorityComponent from './NewsPriorityComponent'
import NewsPriorityNode from './NewsPriorityNode'
import NewsPriorityConverter from './NewsPriorityConverter'

export default {
    name: 'newspriority',
    id: 'se.infomaker.newspriority',
    version: '{{version}}',
    configure: function (config) {

        config.addComponentToSidebarWithTabId(this.id, 'main', NewsPriorityComponent)

        config.addNode(NewsPriorityNode)
        config.addConverter('newsml', NewsPriorityConverter)

        config.addLabel('newsvalue', {
            en: 'Newsvalue',
            sv: 'Nyhetsvärde'
        })
        config.addLabel('Lifetime', {
            en: 'Lifetime',
            sv: 'Livslängd'
        })
        config.addLabel('enter-date-and-time', {
            en: 'Enter date and time',
            sv: 'Ange datum och tid'
        })
    }
}