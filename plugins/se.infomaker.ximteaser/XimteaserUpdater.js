/*
    Fetches missing information (e.g. url) if necessary.

    Moving this out of the component, so it can be implemented in
    a synchronous way.

    Note that ideally such an updater is not necessary. It's better to
    collect all async data before creating the document node.  The purpose
    here is legacy support (as there are documents that have a uuid but no url set)
 */
class XimteaserUpdater {
    constructor(editorSession, node) {
        this.editorSession = editorSession
        this.node = node
        this.requestUpdate() // initial update
    }

    requestUpdate() {
        if (!this.node.url && this.node.uuid) {
            this.fetchUrl()
        }
    }

    // fetchUrl() {
    //     this.context.api.router.get('/api/image/url/' + this.props.node.uuid + '/450')
    //         .done((url) => {
    //             // It is important this is
    //             this.editorSession.set([this.props.node.id, 'url'], url, {noHistory: true})
    //         })
    //         .error((error, xhr, text) => {
    //             // TODO: Display error message
    //             console.error(error, xhr, text);
    //         })
    // }

    // STUB: Use real API (see above)
    fetchUrl() {
        setTimeout(() => {
            let url = 'http://substance.io/images/texture.png'
            // It is important all updates are made through editorSession.transaction
            this.editorSession.transaction((tx) => {
                tx.set([this.node.id, 'url'], url, { noHistory: true })
            })
        }, 2000)
    }

    dispose() {
        // TODO: cancel running ajax requests etc.
    }
}

export default XimteaserUpdater