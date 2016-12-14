const {Component, TextPropertyComponent} = substance

class PreleadinComponent extends Component {

    render($$) {
        return $$('div')
            .addClass('sc-preleadin')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default PreleadinComponent;