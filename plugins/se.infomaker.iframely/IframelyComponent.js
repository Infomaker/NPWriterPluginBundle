import { api } from 'writer'
import { Component } from 'substance'
import Package from './IframelyPackage'


class IframelyComponent extends Component {

    didMount() {
        // Rerender component when the embedCode has loaded
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
        if (this.props.node.embedCode && !this.props.node.iframe) {
            this.props.node.fetchPayload(this.context, (err, res) => {
                this.props.node.document.set([this.props.node.id, 'iframe'], res.iframe)
                this.extendState({
                    iframe: res.iframe
                })
            })
        }
    }

    dispose() {
        this._onClose()
    }

    getInitialState() {
        return {
            iframe: null
        }
    }

    shouldRerender(newProps, newState) {
        // Prevent rerendering every time the node is selected
        const embedCodeChanged = newProps.node.embedCode !== this.props.node.embedCode
        const iframeChanged = newState.iframe !== this.state.iframe
        return embedCodeChanged || iframeChanged
    }

    remove() {
        this.props.node.remove()
    }

    render($$) {
        const el = $$('div').addClass(`im-${Package.name} im-blocknode__container`)

        if (!this.state.iframe) {
            el.append(this._renderLoader($$))
        } else {
            el.append([this._renderHeader($$), this._renderEmbed($$)])
        }

        return el
    }

    _renderLoader($$) {
        const loaderContainer = $$('div').addClass('loader-container').ref('loaderContainer')
        loaderContainer.append(api.getLabel('iframely-loading-message'))
        return loaderContainer
    }

    _renderHeader($$) {
        const header = $$('div').addClass('header')
        const headerText = (this.props.node.title) ? `Iframely embed - ${this.props.node.title}` : `Iframely embed`
        header.append($$('strong').append(headerText))
        return header
    }
    _renderEmbed($$) {
        const embedContent = $$('div').addClass('embed-content').ref('embedContent')
        embedContent.innerHTML = this.state.iframe
        return embedContent
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id)) {
            this.extendState({
                iframe: this.props.node.iframe
            })
        }
    }

    _onClose() {
        // Remove the _onDocumentChange event listener
        this.context.editorSession.off(this)
    }
}

export default IframelyComponent
