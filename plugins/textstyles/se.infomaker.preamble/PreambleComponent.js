const {Component, TextPropertyComponent} = substance

class PreambleComponent extends Component {

    render($$) {
        return $$('div')
            .addClass('sc-preamble')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default PreambleComponent;