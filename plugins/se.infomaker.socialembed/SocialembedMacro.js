export default {

    execute: function(params, context) {
        let editorSession = context.editorSession
        let text = params.text
        let match = /^\s*(https?:\/\/([^\s]+))\s*$/.exec(text)
        if (match) {
            let url = match[1]
            editorSession.selectNode(params.node.id)
            editorSession.executeCommand('socialembed', {
                url: url
            })
            return true
        }
    }
}