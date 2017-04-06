import {Tool} from 'substance'
import {api} from 'writer'

class InlineTextTool extends Tool {
    render($$) {
        let el = $$('div');

        // TODO: use getConfig... for title
        el.append([
            $$('button').attr('title', 'Lägg in faktaruta').addClass('se-tool').append(
                $$('i').addClass('fa fa-bullhorn')
            ).on('click', this.triggerInsert.bind(this))
        ])

        return el
    }

    triggerInsert() {
        // TODO: replace 'insert-factbox'
        api.editorSession.executeCommand('insert-factbox', {})
    }
}

export default InlineTextTool
