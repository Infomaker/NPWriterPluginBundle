export default {

    execute: function (params, context) {
        let editorSession = context.editorSession
        let text = params.text
        // only react on 'break' (as medium does)
        if (!params.action === 'break') return
        // only react of we find a HTTP URL
        let match = /^\s*(https?:\/\/([^\s]+))\s*$/.exec(text)
        if (!match) return
        // take the url, select the node, and run the social embed command
        let url = match[1]

        editorSession.executeCommand('socialembed', {
            url: url
        })
        return true
    }
}