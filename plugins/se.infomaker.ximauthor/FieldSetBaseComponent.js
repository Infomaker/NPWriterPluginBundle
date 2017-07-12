import {Component} from 'substance'

class FieldSetBaseComponent extends Component {

    shouldRerender() {
        return false
    }

    render($$) {
        const {label, inputValue, refName, cssClass, validationFn, isTextArea} = this.props
        let input

        if (!isTextArea) {
            input = $$('input').attr('type', 'text').addClass('form-control')
        } else {
            input = $$('textarea').attr('rows', '4').addClass('form-control')
        }

        input.on('change', () => {
            const message = validationFn(label, refName, this.refs[refName].val())
            this._updateErrorLabel(refName, message)
        })

        return $$('fieldset')
            .addClass('form-group')
            .addClass(cssClass)
            .append($$('label')
                .append(label))
            .append(input.val(inputValue).ref(refName))
            .append($$('span').attr('id', 'error_' + refName).addClass('error-label'))
    }

    _updateErrorLabel(refName, message) {
        const errorLabel = this.refs[refName].parent.getChildren()[2].el.el

        errorLabel.textContent = message
        errorLabel.hidden = !message
    }
}

export default FieldSetBaseComponent