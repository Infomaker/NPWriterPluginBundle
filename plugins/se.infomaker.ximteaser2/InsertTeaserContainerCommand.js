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

        if(teaserPosition === 'top') {
            this.insertTeaserAtTop(params)
        } else {
            this.insertTeaserAtBottom(params)
        }
        // teaserPosition === 'top' ? this.insertTeaserAtTop(params) : this.insertTeaserAtBottom(params)
    }

    /**
     * Insert an empty teaser container at top of the document
     */
    insertTeaserAtTop(params) {

        const editorSession = params.editorSession
        const doc = editorSession.getDocument()

        editorSession.transaction((tx) => {
            // Select the first node to the selection
            const firstNodeId = doc.getNodes()['body'].nodes[0];

            tx.setSelection(doc.createSelection({
                type: 'property',
                containerId: 'body',
                path: [firstNodeId, 'content'],
                startOffset: 0
            }))
            tx.insertBlockNode(this.getEmptyTeaserNode())
        })
    }

    /**
     * Insert an empty teaser at bottom of the document
     * @param params
     */
    insertTeaserAtBottom(params) {
        const editorSession = params.editorSession
        editorSession.transaction((tx) => {
            const body = tx.get('body');
            const node = tx.create(this.getEmptyTeaserNode());
            body.show(node.id);
        })
    }

    /**
     * Get an empty object for a ximteaser node
     * @returns {{type: string, dataType: string, id: *, uuid: string, url: string, imageType: string, title: string, text: string}}
     */
    getEmptyTeaserNode() {

        return {
            type: 'ximteasercontainer',
            id: idGenerator(),
        }

    }
}

export default InsertTeaserContainerCommand
