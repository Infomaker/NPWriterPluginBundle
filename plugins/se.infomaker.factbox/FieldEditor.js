import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'

class FieldEditor extends Component {

    getInitialState() {
        return {
            hasFocus: false
        }
    }

    render($$) {
        if (!this.props.field || !this.props.node || !this.props.placeholder) {
            console.warn('Missing props, field, placeholder or node')
            return $$('span')
        }

        const field = this.props.field,
            node = this.props.node,
            placeholder = this.props.placeholder,
            doc = node.doc

        const titleContainer = $$('div').addClass('im-blocknode__content full-width im-fact-field')

        const inputPlaceholder = $$('div').append(placeholder)
        if (!this.state.hasFocus && node[field].length === 0) {
            inputPlaceholder.addClass('im-placeholder-visible')
        }

        const titleEditor = $$(TextPropertyEditor, {
            path: [node.id, field],
            doc: doc
        })
            .ref(field)
            .on('focus', () => {
                this.setState({hasFocus: true})
            })
            .on('blur', () => {
                this.setState({hasFocus: false})
            })

        const inputContainer = $$('div')
        inputContainer.append([titleEditor, inputPlaceholder])

        const icon = $$(FontAwesomeIcon, {icon: 'fa-header'})
        titleContainer.append([icon, inputContainer])

        return titleContainer
    }
}
export default FieldEditor