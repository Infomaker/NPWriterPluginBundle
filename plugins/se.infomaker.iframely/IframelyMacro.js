import { api } from 'writer'
import urlShouldBeMatched from './urlShouldBeMatched'
import insertIframelyEmbed from './insertIframelyEmbed'

const IframelyMacro = {
    execute: function (params, context) {
        const es = context.editorSession
        const { selection, text, action } = params

        // Only run macro on paste and break
        if (action !== 'paste' && action !== 'break') { return false }

        // Extract url from text
        const url = /^\s*(https?:\/\/([^\s]+))\s*$/.exec(text)

        // Break if the pasted text is not a URL
        if(!url) { return false }

        // Break if the URL should not be matched
        if (!urlShouldBeMatched(url)) { return false }

        const nodeId = selection.getNodeId()
        if (!nodeId) { return false }

        const doc = es.getDocument()

        let nodeToDelete
        if (action === 'break') {
            nodeToDelete = api.document.getPreviousNode(nodeId)
        } else {
            nodeToDelete = doc.get(nodeId)
        }
        api.document.deleteNode('iframely', nodeToDelete)

        es.transaction(tx => {
            insertIframelyEmbed(tx, url[0])
        })

        return true
    }
}

export default IframelyMacro
