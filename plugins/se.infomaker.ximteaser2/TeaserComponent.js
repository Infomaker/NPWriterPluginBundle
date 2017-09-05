import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
class TeaserComponent extends Component {


    render($$) {

        const el = $$('div')

        const titleEditor = $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, 'title'],
            disabled: Boolean(this.props.disabled)
        }).ref('title').addClass('x-im-teaser-title')

        const icon = $$(FontAwesomeIcon, {icon: 'fa-header'})

        el.append([icon, titleEditor])
        return el
    }

}
export default TeaserComponent