import { Component, TextPropertyComponent } from 'substance'

class SubheadlineComponent extends Component {
    render($$) {
        let node = this.props.node;

        return $$('div')
            .addClass("sc-subheadline sc-level-" + node.level)
            .attr('data-id', node.id)
            .append(
                $$(TextPropertyComponent, {
                    path: [node.id, 'content']
                })
            )
    }
}

export default SubheadlineComponent
