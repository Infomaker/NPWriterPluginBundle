import './scss/newspriority.scss'
import NewsPriorityComponent from './NewsPriorityComponent'
import NewsPriorityNode from './NewsPriorityNode'
import NewsPriorityConverter from './NewsPriorityConverter'

class NewsPriorityAPI {

    static match(params) {
        console.log(`Request Match:: ${params}`)
        return true
    }

    execute(tx, params) {
        console.log(`Request Execute:: ${tx} - ${params}`)
        console.log('Doc', params.collabSession.document, 'Nodes', params.collabSession.document.getNodes())

        const {req} = params

        if(req.query.info) {
            const newsprio = tx.get('RYaudnAJj8gQ')
            return JSON.stringify(newsprio)
        } else {
            const score = req.query.score ? req.query.score : 1
            return tx.set(['RYaudnAJj8gQ', 'score'], parseInt(score,10))
        }

    }
}

export default {
    name: 'newspriority',
    id: 'se.infomaker.newspriority',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addComponentToSidebarWithTabId(this.id, 'main', NewsPriorityComponent, pluginConfig, ['newsvalue'])

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

        if(config.addAPI) config.addAPI(NewsPriorityAPI)


    }
}