export default {

    execute: function (params, context) {
        const editorSession = context.editorSession
        const text = params.text

        // only react on 'break' (as medium does)
        if (params.action !== 'break' && params.action !== 'paste') {
            return
        }
        // only react of we find a HTTP URL
        let match = /^\s*(https?:\/\/([^\s]+))\s*$/.exec(text)
        if (!match) return

        // take the url, select the node, and run the social embed command
        let url = match[1]

        let hasMatch = false
        if (url.indexOf('twitter') > 0) {
            hasMatch = true
        } else if (url.indexOf('instagram') > 0) {
            hasMatch = true
        } else if (url.indexOf('facebook') > 0) {
            hasMatch = true
        } else if (url.indexOf('vimeo') > 0) {
            hasMatch = true
        } else if (url.indexOf('soundcloud') > 0) {
            hasMatch = true
        }

        if(hasMatch) {
            editorSession.executeCommand('socialembed', {
                url: url,
                isPaste: true
            })
            return true
        }
        return false
    }
}
