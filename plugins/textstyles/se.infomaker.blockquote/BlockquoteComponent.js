import {Component, TextPropertyComponent} from 'substance'

class BlockquoteComponent extends Component {
    render($$) {
        return $$('div')
            .addClass('sc-paragraph sc-blockquote')
            .attr("data-id", this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, "content"]
            }))
    }
}


export default BlockquoteComponent
