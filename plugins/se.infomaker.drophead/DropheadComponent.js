const {Component, TextPropertyComponent} = substance

class DropheadComponent extends Component {

    render($$) {
        return $$('div')
            .addClass('sc-drophead')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default DropheadComponent;