import { Component } from 'substance'

class ConceptDialogComponent extends Component {

    render($$){
        const title = this.generateInputFormGroup($$, 'name', this.props.item.ConceptName)
        const short = this.generateInputFormGroup($$, 'short', this.props.item.ConceptDefinitionShort)
        const long = this.generateTextFormGroup($$, 'long', this.props.item.ConceptDefinitionLong)
        const form = $$('form')
            .append(title)
            .append(short)
            .append(long)

        const el = $$('div').addClass('conceptDialogComponent col-sm-12')
            .append(form)

        return el
    }

    generateInputFormGroup($$, type, value) {
        const label = $$('label', { for: type }).append(type)
        const input = $$('input', { id: type, class: 'form-control', value: value, placeholder: type }).ref(`${type}Text`)
        const formGroup = $$('div').addClass('form-group')
            .append(label)
            .append(input)

        return formGroup
    }

    generateTextFormGroup($$, type, value) {
        const label = $$('label', { for: type }).append(type)
        const textarea = $$('textarea', { id: type, class: 'form-control', placeholder: type }).append(value).ref(`${type}Text`)
        const formGroup = $$('div').addClass('form-group')
            .append(label)
            .append(textarea)

        return formGroup
    }

    onClose(action) {

        if (action === 'save') {
            this.props.save(Object.assign(this.props.item, {
                ConceptName: this.refs.nameText.val().trim(),
                ConceptDefinitionShort: this.refs.shortText.val().trim(),
                ConceptDefinitionLong: this.refs.longText.val().trim()
            }))
        }

        return true
    }

}

export default ConceptDialogComponent