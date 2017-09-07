import {WriterCommand, idGenerator} from 'writer'

class InsertTeaserCommand extends WriterCommand {
    execute(params, context) {
        const {type, teaserContainerNode} = params
        const {editorSession, api} = context

        const generateTeaserTemplate = api.getPluginModule('teaserTemplate')
        const teaserTemplate = generateTeaserTemplate(type)

        let createdTeaserNode
        editorSession.transaction(tx => {
            createdTeaserNode = tx.create(teaserTemplate)
            console.log(createdTeaserNode)
            tx.set([teaserContainerNode.id, 'nodes'], [...teaserContainerNode.nodes, teaserTemplate.id])
        })

        if(createdTeaserNode) {
            return createdTeaserNode
        }
    }
}

export default InsertTeaserCommand