import {Component, TextPropertyComponent} from 'substance'

class HeadlineComponent extends Component {
    render($$) {
        return $$('div')
            .addClass('sc-headline')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }))
    }
}

export default HeadlineComponent
