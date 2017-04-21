import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

class FieldEditor extends Component {

    getInitialState() {
        return {
            hasFocus: false
        }
    }



    render($$) {

        console.log("this.state.hasFocus", this.state.hasFocus);

        if(!this.props.field || !this.props.node) {
            console.warn('Missing props, field or node')
            return $$('span')
        }

        const field = this.props.field
        const node = this.props.node
        const doc = node.doc

        const titleContainer = $$('div').addClass('im-blocknode__content full-width im-fact-field')

        const inputContainer = $$('div')
        const inputPlaceholderText = api.getConfigValue('se.infomaker.factbox', 'placeholderText.' + field, field)

        const inputPlaceholder = $$('div').append(inputPlaceholderText).ref('ph-' + field)
        if(!this.state.hasFocus && node[field].length === 0) {
            inputPlaceholder.addClass('im-placeholder-visible')
        } else {
            inputPlaceholder.removeClass('im-placeholder-visible')
        }


        // const elem = (this.refs[field]) ? this.refs[field].getNativeElement() : null
        // if (!this.props.node[field] && document.activeElement !== elem) {
        //     inputPlaceholder.addClass('im-placeholder-visible')
        // }

        const titleEditor = $$(TextPropertyEditor, {
            path: [node.id, field],
            doc: doc
        }).ref(field)
            .on('focus', () => {
                this.setState({hasFocus: true})
            })
            .on('blur', () => {
                this.setState({hasFocus: false})
            })

        inputContainer.append([titleEditor, inputPlaceholder])

        const icon = $$(FontAwesomeIcon, {icon: 'fa-header'})
        titleContainer.append([icon, inputContainer])

        return titleContainer

    }
}
export default FieldEditor