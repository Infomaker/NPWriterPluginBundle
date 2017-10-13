import { api } from 'writer'
import { BlockNode } from 'substance'
import fetchOembed from './fetchOembed'

class IframelyNode extends BlockNode {

    fetchPayload(context, callback) {
        if (this.fetching) return callback(null, {})
        this.fetching = true // Prevent fetchPayload from being called twice

        fetchOembed(this.url)
        .then(res => {
            this.fetching = false
            callback(null, {
                url: res.url,
                embedCode: res.html
            })
        }).catch(err => {
            this.fetching = false
            callback(err)
            this.delete()

            // Restore the link if settings allow it
            if (api.getConfigValue('se.infomaker.iframely', 'restoreAfterFailure', true)) {
                this.restoreLink()
            }
        })
    }

    /**
     * Set the embedCode property of the node
     * @param {string} embedCode
     */
    setEmbedCode(embedCode) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'embedCode'], embedCode)
        })
    }

    /**
     * Set the url property of the node
     * @param {string} url
     */
    setUrl(url) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'url'], url)
        })
    }

    /**
     * Restore the pasted link
     */
    restoreLink() {
        api.editorSession.transaction((tx) => {
            tx.insertBlockNode({
                type: 'paragraph',
                dataType: 'body',
                content: this.url
            })
        })
    }

    /**
     * Delete the node
     */
    delete() {
        api.document.deleteNode('iframely', this)
    }
}

IframelyNode.isResource = true
IframelyNode.type = 'iframely'
IframelyNode.define({
    embedCode: { type: 'string', optional: true },
    url: {type: 'string', optional: true },
    dataType: { type: 'string' },
    errorMessage: { type: 'string', optional: true }
})

export default IframelyNode
