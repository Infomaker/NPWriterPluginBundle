export default {

    execute: function (params, context) {
        let editorSession = context.editorSession
        let text = params.text

        // Only react on 'break' (as medium does)
        if (!params.action === 'break') {
            return
        }

        // Only react of we find a HTTP URL
        let match = /^\s*(https?:\/\/([^\s]+))\s*$/.exec(text)
        if (!match) {
            return
        }

        // Take the url, select the node, and run the pdf embed
        let url = match[1]

        // Only react of we find a HTTP(s) URL ending with .pdf
        let hasMatch = false
        if (url.indexOf('.pdf') > 0) {
            hasMatch = true
        }

        if (hasMatch) {
            editorSession.executeCommand('insert-pdfs', {
                files: text
            })
            return true
        }
        return false
    }
}