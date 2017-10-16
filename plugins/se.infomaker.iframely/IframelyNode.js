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
                title: res.title,
                provider: res.provider_name,
                embedCode: res.html
            })
        }).catch(err => {
            this.fetching = false
            callback(err)
            this.remove()

            // Restore the link if settings allow it
            if (api.getConfigValue('se.infomaker.iframely', 'restoreAfterFailure', true)) {
                this.restoreLink()
            }
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
     * Remove the node
     */
    remove() {
        api.document.deleteNode('iframely', this)
    }
}

IframelyNode.isResource = true
IframelyNode.type = 'iframely'
IframelyNode.define({
    embedCode: { type: 'string', optional: true },
    url: {type: 'string', optional: true },
    dataType: { type: 'string' },
    title: { type: 'string', optional: true },
    provider: { type: 'string', optional: true },
    errorMessage: { type: 'string', optional: true }
})

export default IframelyNode
