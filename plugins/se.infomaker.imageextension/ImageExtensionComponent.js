import {Component} from 'substance'

class ImageExtension extends Component {
    constructor(...args) {
        super(...args)

        this.fields = {
            gender: 'Gender bias in image',
            type: 'Describe the main objects in the image',
            premium: "Premium image for sale"
        }
    }

    render($$) {
        const el = $$('div')

        for (var key in this.fields) {
            let value = ''
            if (this.props.properties && typeof this.props.properties[key] !== 'undefined') {
                value = this.props.properties[key]
            }

            if (key === 'premium') {
                el.append(
                    this.renderInputOption($$, key, this.fields[key], value)
                )
            }
            else {
                el.append(
                    this.renderInputField($$, key, this.fields[key], value)
                )
            }
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
                        id: 'imext-' + id,
                        placeholder: this.getLabel(name)
                    })
                    .val(value),
                $$('label')
                    .attr('for', 'imext-' + id)
                    .append(
                        this.getLabel(name)
                    )
            )
    }

    renderInputOption($$, id, name, value) {
        const Toggle = this.getComponent('toggle')

        return $$('div')
            .addClass('form-group')
            .append(
                $$(Toggle, {
                    id: 'crop-toggle',
                    label: this.getLabel(name),
                    checked: value ? true : false,
                    onToggle: (checked) => {
                        // FIXME: Handle change via props callback
                    }
                })
            )
    }
}

export default ImageExtension
