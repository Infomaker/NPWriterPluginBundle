import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

class FieldEditor extends Component {

    getInitialState() {
        return {
            hasFocus: false
        }
    }

    shouldRerender() {
        const newNode = arguments[0].node

        console.log(newNode, newNode[this.props.field]);

        if(newNode[this.props.field].content === this.props.node[this.props.field].content) {
            return false
        }
        return true
    }

    render($$) {

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

        console.log("this.state.hasFocus", this.state.hasFocus);
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