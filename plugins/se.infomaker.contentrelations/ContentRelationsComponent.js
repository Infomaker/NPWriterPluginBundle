import {Component, FontAwesomeIcon} from 'substance'

class ContentRelationsComponent extends Component {

    render($$) {

        const el = $$('div').addClass('im-blocknode__container')

        el.append(this.renderHeader($$))

        el.append(this.renderContent($$))
        el.addClass('x-im-contentrelations')
        el.attr('contentEditable', false)
        return el
    }

    renderContent($$, node) {

        const content = $$('div')
            .addClass('im-blocknode__content')

        const link = $$('a').append(this.props.node.label)
            .attr('href', "#" + this.props.node.uuid)
            .attr('target', '_blank')
            .on('click', function (evt) {
                evt.stopPropagation();
            })

        content.append(link)
        return content
    }


    renderHeader($$) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-external-link'}),
                $$('strong').append(this.getLabel('External link')).attr('contenteditable', false)
            ])
            .addClass('header')
            .attr('contenteditable', false)
    }
}
export default ContentRelationsComponent