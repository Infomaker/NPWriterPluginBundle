const {Component, TextPropertyComponent} = substance

class PagedatelineComponent extends Component {

    render($$) {
        return $$('div')
            .addClass('sc-pagedateline')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }));
    }
}

export default PagedatelineComponent;