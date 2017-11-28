import { Component } from 'substance'
import FormItemModel from '../models/FormItemModel'

class ConceptDialogComponent extends Component {

    constructor(...args) {
        super(...args)
        this.formItemModel = new FormItemModel()
    }

    getInitialState() {
        return {
            loading: true,
            uiGroups: []
        }
    }

    async didMount() {
        const uiGroups = await this.formItemModel.getUiGroups(this.props.item)
        const error = (uiGroups[0].error) ? uiGroups.shift().error : false

        this.extendState({
            loading: false,
            uiGroups: error ? [] : uiGroups,
            error: error ? error : false
        })
    }

    render($$) {
        const el = $$('div').addClass('concept-dialog-component col-sm-12')

        if (this.state.loading) {
            const spinner = $$('i', {
                class: 'fa fa-spinner fa-spin dialog-spinner',
                "aria-hidden": 'true'
            })
            el.append(spinner)
        }

        if (this.state.error) {
            const error = $$('div').addClass('warning').append(this.state.error)

            el.append(error)
        } else {
            this.state.uiGroups.forEach(uiGroup => {
                const fields = []
                const title = $$('h2').append(uiGroup.title)
                const groupTitle = $$('div').append(title).addClass('uigroup-title')

                uiGroup.fields.forEach((field) => {
                    fields.push(
                        field.type === 'text' ?
                            this.generateTextFormGroup($$, field) :
                            this.generateInputFormGroup($$, field)
                    )
                })

                if (fields.length) {
                    el.append(groupTitle)
                    el.append(fields)
                }
            })
        }

        return el
    }

    generateInputFormGroup($$, field) {
        const label = $$('label', { for: field.label }).append(field.label)
        const input = $$('input', { id: field.label, class: 'form-control', value: field.value ? field.value : '', placeholder: field.placeholder }).ref(`${field.refId}`)
        const formGroup = $$('fieldset').addClass('form-group')
            .append(label)
            .append(input)

        return formGroup
    }

    generateTextFormGroup($$, field) {
        const label = $$('label', { for: field.label }).append(field.label)
        const textarea = $$('textarea', { id: field.label, class: 'form-control', placeholder: field.placeholder }).append(field.value ? field.value : '').ref(`${field.refId}`)
        const formGroup = $$('fieldset').addClass('form-group')
            .append(label)
            .append(textarea)

        return formGroup
    }

    onClose(action) {
        if (action === 'save') {
            return this.formItemModel.save(this.refs)
        }
    }

}

export default ConceptDialogComponent