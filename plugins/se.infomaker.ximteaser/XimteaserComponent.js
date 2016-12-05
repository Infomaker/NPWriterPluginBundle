import {Component, TextPropertyEditor, FontAwesomeIcon} from 'substance'
import {api} from 'writer'
import ImageDisplay from '../se.infomaker.ximimage/ImageDisplay'

class XimteaserComponent extends Component {

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)

        // @TODO, how to prevent drag correctly??
        this.parent.parent.attr('draggable', false)
        this.parent.attr('draggable', false)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id) ||
            change.isAffected(this.props.node.imageFile)) {
            this.rerender()
        }
    }

    render($$) {
        const node = this.props.node
        const el = $$('div').addClass('sc-ximteaser im-blocknode__container')
        const teaserFields = api.getConfigValue('se.infomaker.ximteaser', 'fields', [])


        el.append(this.renderHeader($$))
        el.append(this.renderContent($$))

        if (this.props.node.imageFile) {
            el.append(
                $$(ImageDisplay, { // Pass property to images if used in teaser and if drag should be disabled
                    node: node,
                    isolatedNodeState: this.props.isolatedNodeState,
                    isInTeaser: true
                }).ref('image')
            )
        }

        return el
    }


    /**
     * Render component header with icon
     * @param $$
     * @returns {*}
     */

    renderHeader($$) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-newspaper-o'}),
                $$('strong').append(this.getLabel('Teaser'))
            ])
            .addClass('header')
    }


    /**
     * Render content and all text property editors
     * @param $$
     * @returns {*}
     */

    renderContent($$) {
        const content = $$('div')
            .addClass('im-blocknode__content full-width')

        content.append(this.renderSubjectEditor($$))
        content.append(this.renderTitleEditor($$))
        content.append(this.renderTextEditor($$))

        return content
    }

    /**
     * Render text editor for subject if an image exist
     * @param $$
     * @returns {*}
     */
    renderSubjectEditor($$) {
        if (this.props.node.url || this.props.node.previewUrl) {
            const subjectContainer = $$('div')
            const subjectEditor = $$(TextPropertyEditor, {
                tagName: 'div',
                path: [this.props.node.id, 'subject'],
                doc: this.props.doc
            }).ref('subject').addClass('x-im-teaser-subject')
            const icon = $$(FontAwesomeIcon, {icon: 'fa-flag'})

            subjectContainer.append([icon, subjectEditor])
            return subjectContainer
        }
    }

    renderTitleEditor($$) {
        const titleContainer = $$('div')
        const titleEditor = $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, 'title'],
            doc: this.props.doc
        }).ref('title').addClass('x-im-teaser-title')

        const icon = $$(FontAwesomeIcon, {icon: 'fa-header'})

        titleContainer.append([icon, titleEditor])
        return titleContainer
    }

    renderTextEditor($$) {
        const textContainer = $$('div')
        const textEditor = $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, 'text'],
            doc: this.props.doc
        }).ref('text').addClass('x-im-teaser-text')

        const icon = $$(FontAwesomeIcon, {icon: 'fa-paragraph'})

        textContainer.append([icon, textEditor])
        return textContainer
    }
}

export default XimteaserComponent