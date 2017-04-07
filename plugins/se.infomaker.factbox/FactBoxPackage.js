import FactBoxCommand from './FactBoxCommand'
import FactBoxComponent from './FactBoxComponent'
import FactBoxConverter from './FactBoxConverter'
import FactBoxNode from './FactBoxNode'
import FactBoxTool from './FactBoxTool'
import './scss/fact.scss'

export default {
    name: 'factbox',
    id: 'se.infomaker.factbox',
    configure: function (config) {
        config.addNode(FactBoxNode)
        config.addContentMenuTopTool('insert-factbox', FactBoxTool)
        config.addCommand('insert-factbox', FactBoxCommand)
        config.addComponent('factbox', FactBoxComponent)
        config.addConverter('newsml', FactBoxConverter)

        config.addLabel('title', {
            sv: 'Rubrik',
            en: 'Headline'
        })

        config.addLabel('vignette', {
            sv: 'Fakta',
            en: 'Fact'
        })
    }
}
