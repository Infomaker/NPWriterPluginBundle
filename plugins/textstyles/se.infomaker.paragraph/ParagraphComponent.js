import {Component, TextPropertyComponent} from 'substance'

class ParagraphComponent extends Component {
    render($$) {
        return $$('div')
            .addClass('sc-paragraph')
            .attr("data-id", this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, "content"]
            }))
    }
}

export default ParagraphComponent
