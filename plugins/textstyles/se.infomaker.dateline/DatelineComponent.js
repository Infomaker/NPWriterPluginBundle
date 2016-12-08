const {Component, TextPropertyComponent} = substance

class DatelineComponent extends Component {

    render($$) {
        return $$('div')
            .addClass('sc-dateline')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default DatelineComponent;