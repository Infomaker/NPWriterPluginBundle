const {Component, TextPropertyComponent} = substance

class PreleadinComponent extends Component {
    render($$) {
        return $$('div')
        .css({
            position: 'relative'
        })
        .append([
            this.renderLabel($$),
            this.renderTextContent($$)
        ])
    }

    renderLabel($$) {
        return $$('div')
            .addClass('sc-textstyle-label sc-preleadin-label')
            .append(
                this.getLabel('headline.short')
            )
    }

    renderTextContent($$) {
        return $$('div')
            .addClass('sc-preleadin')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default PreleadinComponent;
