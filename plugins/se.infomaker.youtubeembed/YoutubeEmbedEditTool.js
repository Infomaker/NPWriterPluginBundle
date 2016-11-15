import {Tool} from 'substance'
import {api} from 'writer'

class YoutubeEmbedEditTool extends Tool {

    constructor(...args) {
        super(...args)
    }

    render($$) {
        const el = $$('div')

        const youtubeURLInput = $$('input').attr('type', 'text').addClass('form-control').ref('youtubeURL')
        el.append(youtubeURLInput)

        return el
    }

    onClose(action) {

        if(action === 'save') {
            api.editorSession.executeCommand('youtubeembededit', {
                url: this.refs.youtubeURL.val()
            })

        }
        return true
    }

}
export default YoutubeEmbedEditTool