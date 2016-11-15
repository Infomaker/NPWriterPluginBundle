import {Component} from 'substance'
import {api} from 'writer'

class YoutubeEmbedComponent extends Component {

    didMount() {
        api.editorSession.onRender('document', this.rerender, this, { path: [this.props.node.id] })
        api.document.triggerFetchResourceNode(this.props.node)
    }


    dispose() {
        api.editorSession.off(this)
    }


    render($$) {
        const node = this.props.node
        const el = $$('div')


        el.append($$('div').append($$('img').attr('src', node.thumbnail_url).attr('style', 'width:100%')))
        el.append($$('h2').append(node.title).attr('style', 'background-color: #efefef; padding: 10px 15px; font-size:1rem'))
        return el
    }
}

export default YoutubeEmbedComponent