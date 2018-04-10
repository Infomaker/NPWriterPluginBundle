import {Component, TextPropertyComponent} from 'substance'
import './scss/textstyles.scss'

class TextstyleComponent extends Component {

    didMount() {
        this.context.api.events.on(`textstyle-${this.props.node.id}`, 'document:changed', (event) => {
            if (!event.data || !event.data.data || !event.data.data.updated) {
                return
            }

            const nodeId = this.props.node.id
            const updatedNodes = event.data.data.updated

            for (const id in updatedNodes) {
                if (id === nodeId) {
                    return this.rerender()
                }
            }
        })
    }

    dispose() {
        this.context.api.events.off(`textstyle-${this.props.node.id}`, 'document:changed')
    }

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
        const classNames = this.props.node.content !== "" ? options.textClassName : `${options.textClassName} im-placeholder`

        return $$('div')
            .addClass(classNames)
            .attr({
                'data-id': this.props.node.id,
                'data-placeholder': options.longLabel
            })
            .append($$(TextPropertyComponent, {
                path: [this.props.node.id, 'content']
            }))
    }
}

export default TextstyleComponent
