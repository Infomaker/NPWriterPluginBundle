const {Component, TextPropertyComponent} = substance

class MadmansrowComponent extends Component {

    render($$) {
        return $$('div')
            .addClass('sc-madmansrow')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default MadmansrowComponent;