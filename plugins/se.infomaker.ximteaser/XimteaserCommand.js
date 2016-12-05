import {WriterCommand, api, idGenerator} from 'writer'

class XimteaserCommand extends WriterCommand {


    execute(params, context) {
        const id = this.config.id
        const teaserPosition = context.api.getConfigValue(this.config.id, 'teaserPosition', 'bottom')

        switch (teaserPosition) {
            case 'top':
                this.insertTeaserAtTop(params)
                break

            default:
                this.insertTeaserAtBottom(params)
                break
        }

    }

    insertTeaserAtTop(params) {
        const surface = params.surface
        const editorSession = params.editorSession
        const doc = editorSession.getDocument()
        let result

        editorSession.transaction((tx, args) => {

            const firstNodeId = doc.getNodes()['body'].nodes[0];
            //
            // args.selection = doc.createSelection({
            //     type: 'property',
            //     containerId: 'body',
            //     path: [firstNodeId, 'content'],
            //     startOffset: 0
            // });
            // args.node = this.getEmptyTeaserNode();
            // args.containerId = 'body';
            // result = surface.insertNode(tx, args);

            tx.selection = doc.createSelection({
                type: 'property',
                containerId: 'body',
                path: [firstNodeId, 'content'],
                startOffset: 0
            })
            tx.insertBlockNode(this.getEmptyTeaserNode())

        })

        // var inserted = doc.getNodes()['body'].nodes[0];
        // var node = doc.get(inserted);
        // api.document.deleteNode('ximteaser', node);

    }

    insertTeaserAtBottom(data) {

        var surface = this.context.controller.getFocusedSurface();
        surface.transaction(function (tx) {
            var body = tx.get('body');
            var node = tx.create(data);
            body.show(node.id);
        });

        return data.id;
    }

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