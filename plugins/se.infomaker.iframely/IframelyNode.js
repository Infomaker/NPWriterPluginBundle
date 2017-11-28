import { api } from 'writer'
import { BlockNode } from 'substance'
import fetchOembed from './fetchOembed'
import fetchWriterIframe from './fetchWriterIframe'

class IframelyNode extends BlockNode {

    fetchPayload(context, callback) {
        if (this.fetching) return callback(null, {})

        this.fetching = true

        if (this.embedCode) return this.loadFromNode(callback)

        fetchOembed(this.url)
        .then(res => {
            if (!res.html) {
                throw new Error('No embedCode found for link')
            }

            this.fetching = false
            callback(null, {
                url: res.url,
                title: res.title,
                provider: res.provider_name,
                embedCode: res.html,
                iframe: res.writerIframe
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
     * Load everything from the node and add the writer iframe
     * @param  {function} callback
     */
    loadFromNode(callback) {
        fetchWriterIframe(this.url).then(writerIframe => {
            this.fetching = false
            callback(null, {
                iframe: writerIframe
            })
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
    iframe: { type: 'string', optional: true },
    url: {type: 'string', optional: true },
    dataType: { type: 'string' },
    title: { type: 'string', optional: true },
    errorMessage: { type: 'string', optional: true }
})

export default IframelyNode
