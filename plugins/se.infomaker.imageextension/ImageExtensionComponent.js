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

    renderInputField($$, key, name, value) {
        return $$('div')
            .addClass('form-group flexible-label')
            .append (
                $$('input')
                    .ref(key)
                    .on('change', () => {
                        this.props.onChange(key, this.refs[key].val())
                    })
                    .addClass('form-control')
                    .attr({
                        required: 'required',
                        type: 'text',
                        id: 'imext-' + key,
                        placeholder: this.getLabel(name)
                    })
                    .val(value),
                $$('label')
                    .attr('for', 'imext-' + key)
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
                        this.props.onChange(id, checked)
                    }
                })
            )
    }
}

export default ImageExtension
