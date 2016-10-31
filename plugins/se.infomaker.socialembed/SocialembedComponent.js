const { Component } = substance

class SocialembedComponent extends Component {
    render($$) {
        var node = this.props.node,
            htmlContainer;

        var el = $$('a')
            .addClass('socialembed__container')
            .addClass(node.socialChannel)
                .attr('contenteditable', false);

        // TODO: activate
        // this.context.api.handleDrag(
        //     el,
        //     this.props.node
        // );

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

        var html = node.html

        htmlContainer = $$('div')
            .addClass('socialembed__content')
            .html(html)

        innerEl.append(htmlContainer)
        el.append(innerEl)
        return el
    }

    removeEmbed() {
        this.context.api.document.deleteNode('socialembed', this.props.node)
    }
}

SocialembedComponent.noStyle = true

export default SocialembedComponent
