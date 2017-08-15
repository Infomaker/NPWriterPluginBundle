import {Component, FontAwesomeIcon} from 'substance'
import TwitterComponent from './TwitterComponent'
import FacebookComponent from './FacebookComponent'

class SocialembedComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this.rerender, this, {path: [this.props.node.id]})
        this.context.api.document.triggerFetchResourceNode(this.props.node, {history: false})
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    shouldRerender() {
        const node = this.props.node
        return !node.hasPayload();

    }

    render($$) {
        const node = this.props.node


        const el = $$('div')
            .addClass('im-blocknode__container')
            .addClass(node.socialChannel)
            .attr('contenteditable', false);


        // Only when HTML has been resolved
        if (node.hasPayload()) {
            const innerEl = $$('div').ref('embed-container')
            const headerEl = this.renderHeader($$, node)
            const contentEl = this.renderContent($$, node)

            innerEl.append([headerEl, contentEl])
            el.append(innerEl)

        } else if (node.errorMessage) {
            el.append(
                $$('div').addClass('se-error').append(
                    node.errorMessage
                )
            )
        } else {
            el.append($$(FontAwesomeIcon, {icon: 'fa-spin fa-refresh'}))
        }
        return el
    }

    getDefaultRenderer($$) {
        return this.getContentContainer($$).html(this.props.node.html)
    }


    /**
     * Returns a div component with correct class and ref
     * @param $$
     */
    getContentContainer($$) {
        return $$('div').ref('embedContent')
            .addClass('im-blocknode__content full-width')
    }

    renderContent($$, node) {
        const availableRenderComponents = [
            {linkType: 'x-im/tweet', component: TwitterComponent},
            {linkType: 'x-im/facebook-post', component: FacebookComponent}
        ]

        const renderComponent = availableRenderComponents.find((component) => {
            return component.linkType === node.linkType
        })

        return renderComponent ? this.getContentContainer($$).append($$(renderComponent.component, {node: node})) : this.getDefaultRenderer($$)

    }

    renderHeader($$, node) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: node.socialChannelIcon}),

                $$('strong').append(
                    node.socialChannel
                ).attr('contenteditable', false)

            ])
            .addClass('header')
            .attr('contenteditable', false)
    }

    removeEmbed() {
        this.context.api.document.deleteNode('socialembed', this.props.node)
    }
}

SocialembedComponent.noStyle = true

export default SocialembedComponent
