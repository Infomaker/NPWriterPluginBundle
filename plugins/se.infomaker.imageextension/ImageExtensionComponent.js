import {Component} from 'substance'

class ImageExtension extends Component {
    constructor(...args) {
        super(...args)

        this.fields = {
            gender: 'Gender bias in image',
            type: 'Describe the main objects in the image'
        }
    }

    render($$) {
        const el = $$('div')
        for (var key in this.fields) {
            let value = ''
            if (this.props.properties && typeof this.props.properties[key] !== 'undefined') {
                value = this.props.properties[key]
            }

            el.append(
                this.renderInputField(
                    $$,
                    key,
                    this.fields[key],
                    value
                )
            )
        }

        return el
    }

    renderInputField($$, id, name, value) {
        return $$('div')
            .addClass('form-group flexible-label')
            .append (
                $$('input')
                    .on('change', () => {
                        // FIXME: Handle change via props callback
                    })
                    .addClass('form-control')
                    .attr({
                        required: 'required',
                        type: 'text',
                        id: 'dialog-image-info-' + id,
                        placeholder: this.getLabel(name)
                    })
                    .val(value),
                $$('label')
                    .attr('for', 'dialog-image-info-' + id)
                    .append(
                        this.getLabel(name)
                    )
            )
    }
}

export default ImageExtension
