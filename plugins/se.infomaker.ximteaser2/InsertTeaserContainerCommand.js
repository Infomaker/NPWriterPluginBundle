import {WriterCommand, idGenerator} from 'writer'

class InsertTeaserContainerCommand extends WriterCommand {

    constructor(...args) {
        super(...args)
        this.name = 'ximteasercontainer'
    }

    execute(params, context) {

        const {api} = context

        const teaserPosition = api.getConfigValue(this.config.id, 'teaserPosition', 'bottom')

        const nodes = api.document.getDocumentNodes()

        const existingTeaser = nodes.filter((node) => {
            return node.type === 'ximteasercontainer'
        })

        if (existingTeaser.length > 0) {
            api.ui.showNotification('se.infomaker.ximteaser2', api.getLabel('A teaser already exist'), api.getLabel('There is already a teaser in this document'))
            return false
        }

        if (teaserPosition === 'top') {
            this.insertTeaserAtTop(params, api)
        } else {
            this.insertTeaserAtBottom(params, api)
        }
        // teaserPosition === 'top' ? this.insertTeaserAtTop(params) : this.insertTeaserAtBottom(params)
    }

    /**
     * Insert an empty teaser container at top of the document
     */
    insertTeaserAtTop(params, api) {

        const editorSession = params.editorSession
        const doc = editorSession.getDocument()

        editorSession.transaction((tx) => {
            // Select the first node to the selection

            const containerNode = this.getEmptyTeaserContainerNode()
            const teaserNode = this.createInitialTeaserNode(tx, api)

            const firstNodeId = doc.getNodes()['body'].nodes[0]

            tx.setSelection(doc.createSelection({
                type: 'property',
                containerId: 'body',
                path: [firstNodeId, 'content'],
                startOffset: 0
            }))
            tx.insertBlockNode(containerNode)
            containerNode.nodes.push(teaserNode.id)
        })
    }

    createInitialTeaserNode(tx, api) {
        const generateTeaserTemplate = api.getPluginModule('se.infomaker.ximteaser2.teasertemplate')
        const teaserNode = generateTeaserTemplate('x-im/teaser', 'Teaser')
        tx.create(teaserNode)
        return teaserNode
    }

    /**
     * Insert an empty teaser container with a teaser at bottom of the document
     * @param params
     */
    insertTeaserAtBottom(params, api) {
        const editorSession = params.editorSession
        const doc = editorSession.getDocument()

        const containerNode = this.getEmptyTeaserContainerNode()

        editorSession.transaction((tx) => {
            const body = tx.get('body');
            const teaserNode = this.createInitialTeaserNode(tx, api)
            const node = tx.create(containerNode)
            containerNode.nodes.push(teaserNode.id)
            body.show(node.id);
        })

        editorSession.transaction(tx => {
            const sel = doc.createSelection({
                type: 'node',
                nodeId: containerNode.id,
                containerId: 'body',
                surfaceId: 'body'
            })
            tx.setSelection(sel)
        })
    }

    /**
     * Get an empty object for a ximteaser node
     * @returns {{type: string, dataType: string, id: *, uuid: string, url: string, imageType: string, title: string, text: string}}
     */
    getEmptyTeaserContainerNode() {

        return {
            type: 'ximteasercontainer',
            id: idGenerator(),
            nodes: []
        }

    }
}

export default InsertTeaserContainerCommand
