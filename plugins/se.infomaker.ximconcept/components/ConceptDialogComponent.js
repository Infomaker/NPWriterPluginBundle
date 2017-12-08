import { Component } from 'substance'
import ConceptItemModel from '../models/ConceptItemModel'

class ConceptDialogComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        return {
            loading: true,
            uiGroups: []
        }
    }

    dispose() {
        this.conceptItemModel = null
    }

    async didMount() {
        this.send('dialog:disablePrimaryBtn')
        this.conceptItemModel = new ConceptItemModel(this.props.item, this.props.config)

        const uiGroups = await this.conceptItemModel.getUiGroups()
        const errors = uiGroups.filter(group => {
            return group.error
        })

        if (errors.length) {
            this.extendState({
                loading: false,
                uiGroups: [],
                errors: errors
            })
        } else {
            this.send('dialog:enablePrimaryBtn')

            this.extendState({
                loading: false,
                uiGroups: uiGroups,
                errors: null
            })
        }
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

        if (this.state.errors) {
            const errorEl = $$('div').addClass('warning')
            
            this.state.errors.forEach(errorObject => {
                errorEl.append($$('p').append(errorObject.error))
            })

            el.append(errorEl)
        }
        
        if (this.state.uiGroups.length) {
            this.state.uiGroups.forEach(uiGroup => {
                const fields = []
                const title = $$('h2').append(uiGroup.title)
                const groupTitle = $$('div').append(title).addClass('concept-form-title')

                uiGroup.fields.forEach((field) => {
                    let group
                    switch (field.type) {
                        case 'text':
                            group = this.generateTextFormGroup($$, field)
                            break

                        case 'string':
                        case 'email':
                            group = this.generateInputFormGroup($$, field)
                            break

                        default:
                            break;
                    }

                    fields.push(group)
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
        const input = $$('input', { id: field.label, class: 'concept-form-control', type: field.type, value: field.value ? field.value : '', placeholder: field.placeholder, pattern: field.validation }).ref(`${field.refId}`)

        if (field.required) {
            input.attr('required', true)
        }
        
        return this.generateFormGroup($$)
            .append(this.generateLabel($$, field))
            .append(input)
    }

    generateTextFormGroup($$, field) {
        const rows = (field.value && field.value.length) ? (field.value.length / 80) + 2 : 3
        const textarea = $$('textarea', { id: field.label, class: 'concept-form-control', placeholder: field.placeholder, rows: rows }).append(field.value ? field.value : '').ref(`${field.refId}`)

        return this.generateFormGroup($$)
            .addClass('textarea-group')
            .append(this.generateLabel($$, field))
            .append(textarea)
    }

    generateFormGroup($$) {
        return $$('div').addClass('concept-form-group')
    }

    generateLabel($$, field) {
        return $$('label', { for: field.label, class: 'concept-form-label' }).append(field.label)
    }

    async onClose(action) {
        if (action === 'save') {
            this.props.save(
                await this.conceptItemModel.save(this.refs)
            )
        }
    }

}

export default ConceptDialogComponent