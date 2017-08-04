import {Component, FontAwesomeIcon, TextPropertyEditor} from 'substance'
import {api} from 'writer'

class YoutubeEmbedComponent extends Component {

    constructor(...args) {
        super(...args)
        api.document.triggerFetchResourceNode(this.props.node, {history: false})
    }

    didMount() {
        api.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id] })
    }

    dispose() {
        api.editorSession.off(this)
    }

    shouldRerender() {
        return this.props.node.hasPayload() ? false : true
    }

    grabFocus() {
        let startTime = this.refs.startTime
        this.context.editorSession.setSelection({
            type: 'property',
            path: startTime.getPath(),
            startOffset: 0
        })
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


        //<iframe width="560" height="315" src="https://www.youtube.com/embed/fvlkV_FhuEY" frameborder="0" allowfullscreen></iframe>
        const embedContainer = $$('div').html(this.props.node.html)

        const startTimeEditor = $$(TextPropertyEditor, {
            tagName: 'div',
            path: [this.props.node.id, 'start'],
            doc: this.props.doc
        }).ref('startTime').addClass('start-time-editor')

        content.append(embedContainer)
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
