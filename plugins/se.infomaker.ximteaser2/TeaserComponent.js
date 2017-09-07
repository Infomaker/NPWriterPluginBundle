import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
class TeaserComponent extends Component {


    render($$) {

        const el = $$('div').addClass('teaser-container')

        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        el.append($$(FieldEditor, {
            node: this.props.node,
            multiLine: true,
            field: 'title',
            placeholder: 'Title'
        }).ref('titleFieldEditor'))

        return el
    }

}
export default TeaserComponent