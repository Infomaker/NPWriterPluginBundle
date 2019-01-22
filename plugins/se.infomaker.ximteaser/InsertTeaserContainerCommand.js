import {WriterCommand, idGenerator} from 'writer'

class InsertTeaserContainerCommand extends WriterCommand {

    constructor(...args) {
        super(...args)
        this.name = 'ximteasercontainer'
    }

    execute(params, context) {
        const {api} = context
        const teaserPosition = api.getConfigValue(this.config.id, 'teaserPosition', 'bottom')
        const nodes = api.document.nodes('ximteasercontainer')

        if (nodes.length > 0) {
            api.ui.showNotification(
                'se.infomaker.ximteaser',
                api.getLabel('A teaser already exist'),
                api.getLabel('There is already a teaser in this document')
            )
            return false
        }

        this.insertTeaser(
            params,
            api,
            teaserPosition === 'top' ? 'first' : 'last'
        )
    }

    insertTeaser(params, api, mode) {
        params.editorSession.transaction(tx => {
            api.document.insertBlockNode({
                tx: tx,
                mode: mode,
                data: {
                    type: 'ximteasercontainer',
                    id: idGenerator(),
                    nodes: [
                        this.createInitialTeaserNode(tx, api)
                    ]
                }
            })
        })
    }

    createInitialTeaserNode(tx, api) {
        const generateTeaserTemplate = api.getPluginModule('se.infomaker.ximteaser.teasertemplate')
        const teaserNode = generateTeaserTemplate('x-im/teaser', 'Teaser')

        const emptyParamNode = tx.create({
            type: 'paragraph',
            content: ''
        })
        teaserNode.nodes.push(emptyParamNode.id)

        tx.create(teaserNode)

        return teaserNode.id
    }
}

export default InsertTeaserContainerCommand
