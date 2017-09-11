import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
class TeaserComponent extends Component {


    render($$) {

        const {api} = this.context
        const el = $$('div').addClass('teaser-container').ref('teaserContainer')
        const types = api.getConfigValue('se.infomaker.ximteaser2', 'types')
        const currentType = types.find(({type}) => type === this.props.node.dataType)

        const FieldEditor = api.ui.getComponent('field-editor')

        if(currentType.fields && currentType.fields.length) {
            const editorFields = currentType.fields.map((field) => {
                return $$(FieldEditor, {
                    node: this.props.node,
                    multiLine: field.multiline ? field.multiline : false,
                    field: field.id,
                    icon: field.icon,
                    placeholder: field.caption
                }).ref(`${field.id}FieldEditor`)
            })

            el.append(editorFields)
        } else {
            el.append($$('span').append('No fields configured for teaser'))
        }

        return el
    }

}
export default TeaserComponent