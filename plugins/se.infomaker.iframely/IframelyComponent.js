import { api } from 'writer'
import { Component } from 'substance'
import Package from './IframelyPackage'


class IframelyComponent extends Component {

    didMount() {
        // Rerender component when the embedCode has loaded
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this._onClose()
    }

    shouldRerender(newProps) {
        // Prevent rerendering every time the node is selected
        return newProps.node.embedCode !== this.props.node.embedCode
    }

    setUrl(url) {
        this.props.node.setUrl(url);
    }

    setEmbedCode(embedCode) {
        this.props.node.setEmbedCode(embedCode);
    }

    remove() {
        this.props.node.remove()
    }

    render($$) {
        const el = $$('div').addClass(`im-${Package.name} im-blocknode__container`)

        if (!this.props.node.embedCode) {
            el.append(this._renderLoader($$))
        } else {
            el.append(this._renderEmbed($$))
        }

        return el
    }

    _renderLoader($$) {
        const loaderContainer = $$('div').addClass('loader-container').ref('loaderContainer')
        loaderContainer.append(api.getLabel('iframely-loading-message'))
        return loaderContainer
    }

    _renderEmbed($$) {
        const embedContent = $$('div').addClass('embed-content').ref('embedContent')
        embedContent.innerHTML = this.props.node.embedCode
        return embedContent
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id)) {
            this.rerender()
        }
    }

    _onClose() {
        // Remove the _onDocumentChange event listener
        this.context.editorSession.off(this)
    }
}

export default IframelyComponent
