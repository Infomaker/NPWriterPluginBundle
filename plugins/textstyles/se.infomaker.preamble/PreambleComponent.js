const {Component, TextPropertyComponent} = substance

class PreambleComponent extends Component {

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
            .addClass('sc-textstyle-label sc-preamble-label')
            .append(
                this.getLabel('preamble.short')
            )
    }

    renderTextContent($$) {
        return $$('div')
            .addClass('sc-preamble')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default PreambleComponent;
