import {Component, FontAwesomeIcon} from 'substance'

class ContentRelationsComponent extends Component {

    render($$) {
        const el = $$('div', { class: 'im-blocknode__container x-im-contentrelations', 'contentEditable': false }, [
            $$('div', { class: 'header', 'contenteditable': false }, [
                $$(FontAwesomeIcon, { icon: 'fa-external-link' }),
                $$('strong').append(this.getLabel('External link')).attr('contenteditable', false)
            ]),
            $$('div', { class: 'im-blocknode__content' }, [
                $$('a', { 'href': `#${this.props.node.uuid}`, 'target': '_blank' }, this.props.node.label).on('click', function (evt) {
                    evt.stopPropagation();
                })
            ])
        ])

        return el
    }
}

export default ContentRelationsComponent
