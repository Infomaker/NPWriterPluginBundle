export default {

    execute: function (params, context) {
        let editorSession = context.editorSession
        let text = params.text

        // only react on 'break' (as medium does)
        if (!params.action === 'break') return

        // only react of we find a HTTP(s) URL ending with .pdf
        let hasMatch = false
        if (text.indexOf('.pdf') > 0 && (text.startsWith('http://') || text.startsWith('https://'))) {
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