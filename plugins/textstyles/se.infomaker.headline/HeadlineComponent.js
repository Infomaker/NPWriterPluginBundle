import {Component, TextPropertyComponent} from 'substance'

class HeadlineComponent extends Component {
    render($$) {
        return $$('div')
        .css({
            position: 'relative'
        })
        .append([
            this.renderLabel($$),
            this.renderTextContent($$)
        ])
    }

    renderLabel($$) {
        return $$('div')
            .addClass('sc-textstyle-label sc-headline-label')
            .append(
                this.getLabel('headline.short')
            )
    }

    renderTextContent($$) {
        return $$('div')
            .addClass('sc-headline')
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }))
    }
}

export default HeadlineComponent
