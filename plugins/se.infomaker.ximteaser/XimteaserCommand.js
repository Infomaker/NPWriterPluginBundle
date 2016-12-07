import {WriterCommand, api, idGenerator} from 'writer'

class XimteaserCommand extends WriterCommand {


    execute(params, context) {
        const id = this.config.id
        const teaserPosition = context.api.getConfigValue(this.config.id, 'teaserPosition', 'bottom')

        const nodes = api.document.getDocumentNodes()
        const existingTeaser = nodes.filter((node) => {
            return node.dataType === 'x-im/teaser'
        })
        if(existingTeaser.length > 0) {
            api.ui.showNotification('se.infomaker.ximteaser', api.getLabel('A teaser already exist'), api.getLabel('There is already a teaser in this document'))
            return false
        }

        switch (teaserPosition) {
            case 'top':
                this.insertTeaserAtTop(params)
                break

            default:
                this.insertTeaserAtBottom(params)
                break
        }

    }

    /**
     * Insert an empty teaser at top of the document
     * @param params
     */
    insertTeaserAtTop(params) {
        const editorSession = params.editorSession
        const doc = editorSession.getDocument()

        editorSession.transaction((tx, args) => {

            // Select the first node to the selection
            const firstNodeId = doc.getNodes()['body'].nodes[0];

            tx.selection = doc.createSelection({
                type: 'property',
                containerId: 'body',
                path: [firstNodeId, 'content'],
                startOffset: 0
            })
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
     * @returns {{type: string, dataType: string, id: *, uuid: string, url: string, previewUrl: string, imageType: string, title: string, text: string}}
     */
    getEmptyTeaserNode() {

        return {
            type: 'ximteaser',
            dataType: 'x-im/teaser',
            id: idGenerator(),
            uuid: '',
            url: '',
            previewUrl: '',
            imageType: 'x-im/image',
            title: '',
            text: ''
        }

    }

}
export default XimteaserCommand