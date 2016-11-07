const { Command } = substance

class SocialembedCommand extends Command {

    getCommandState() {
        return { disabled: false }
    }

    execute(params, context) {
        let node = {
            type: 'socialembed',
            dataType: 'x-im/socialembed',
            url: params.url
        }

        params.editorSession.selectNode(params.nodeId)
        context.api.document.insertBlockNode(node.type, node)
        return true
    }
}

export default SocialembedCommand