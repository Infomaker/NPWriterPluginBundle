import {Component, TextPropertyComponent} from 'substance'

class TextstyleComponent extends Component {
    render($$, options) {
        return $$('div')
        .css({
            position: 'relative'
        })
        .append([
            this.renderLabel($$, options),
            this.renderTextContent($$, options)
        ])
    }

    renderLabel($$, options) {
        return $$('div')
            .attr('contenteditable', 'false')
            .addClass('sc-textstyle-label ' + options.labelClassName || '')
            .append([
                $$('div')
                    .attr('contenteditable', 'false')
                    .append(options.shortLabel),
                $$('div')
                    .attr('contenteditable', 'false')
                    .append(options.longLabel)
            ])
    }

    renderTextContent($$, options) {
        return $$('div')
            .addClass(options.textClassName)
            .attr('data-id', this.props.node.id)
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }))
    }
}

export default TextstyleComponent
