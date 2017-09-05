import {WriterCommand, idGenerator} from 'writer'

class InsertTeaserCommand extends WriterCommand {
    execute(params, context) {
        const {type, teaserContainerNode} = params
        const {editorSession, api} = context

        const generateTeaserTemplate = api.getPluginModule('teaserTemplate')
        const teaserTemplate = generateTeaserTemplate(type)

        editorSession.transaction(tx => {
            tx.create(teaserTemplate)
            tx.set([teaserContainerNode.id, 'nodes'], [...teaserContainerNode.nodes, teaserTemplate.id])
        })

        console.log(params)
    }
}

export default InsertTeaserCommand