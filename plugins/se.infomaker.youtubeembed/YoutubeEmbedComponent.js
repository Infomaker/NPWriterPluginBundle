import {Component, FontAwesomeIcon, TextPropertyEditor} from 'substance'
import {api} from 'writer'

class YoutubeEmbedComponent extends Component {

    constructor(...args) {
        super(...args)
        api.document.triggerFetchResourceNode(this.props.node)
    }

    didMount() {
        api.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id] })
    }

    dispose() {
        api.editorSession.off(this)
    }

    render($$) {
        const el = $$('div').addClass('im-blocknode__container im-youtube')

        el.append(this.renderHeader($$))
        el.append(this.renderContent($$))
        return el
    }

    renderContent($$) {
        const content = $$('div')
            .addClass('im-blocknode__content full-width')

        const thumbnail = $$('img').attr('src', this.props.node.thumbnail_url).attr('style', 'width:100%')

        const startTimeEditor = $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, 'start'],
            doc: this.props.doc
        }).ref('startTime').addClass('start-time-editor')

        content.append(thumbnail)
        content.append($$(FontAwesomeIcon, {icon: 'fa-clock-o'}))
        content.append(startTimeEditor)
        return content
    }


    renderHeader($$) {
        return $$('div')
            .append([
                $$(FontAwesomeIcon, {icon: 'fa-youtube'}),
                $$('strong').append(this.getLabel('Youtube video') + ' - '+ this.props.node.title)
            ])
            .addClass('header')
    }
}

export default YoutubeEmbedComponent
