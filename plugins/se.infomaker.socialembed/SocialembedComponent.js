import { Component } from 'substance'

class SocialembedComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id] })
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    render($$) {
        var node = this.props.node,
            htmlContainer;

        var el = $$('a')
            .addClass('socialembed__container')
            .addClass(node.socialChannel)
                .attr('contenteditable', false);

        // Only when HTML has been resolved
        if (node.hasPayload()) {
            var innerEl = $$('div').append(
                $$('div').append([
                    $$('strong').append(
                        node.socialChannel
                    )
                    .attr('contenteditable', false),
                    $$('span').addClass('remove-button').append(
                        this.context.iconProvider.renderIcon($$, 'delete')
                    )
                    .on('click', this.removeEmbed)
                    .attr('title', this.getLabel('Remove from article'))
                ])
                .addClass('header')
                .addClass(node.socialChannelIcon)
                .attr('contenteditable', false)
            )
            htmlContainer = $$('div')
                .addClass('socialembed__content')
                .html(node.html)
            innerEl.append(htmlContainer)
            el.append(innerEl)
        } else if (node.errorMessage) {
            el.append(
                $$('div').addClass('se-error').append(
                    node.errorMessage
                )
            )
        } else {
            el.append('Loading...')
        }
        return el
    }

    removeEmbed() {
        this.context.api.document.deleteNode('socialembed', this.props.node)
    }
}

SocialembedComponent.noStyle = true

export default SocialembedComponent
