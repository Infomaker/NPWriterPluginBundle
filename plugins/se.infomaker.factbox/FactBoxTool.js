import {Tool} from 'substance'
import {api} from 'writer'

class FactBoxTool extends Tool {
    render($$) {
        let el = $$('div');

        el.append([
            $$('button').attr('title', 'Lägg in faktaruta').addClass('se-tool').append(
                $$('i').addClass('fa fa-bullhorn')
            ).on('click', this.triggerInsert.bind(this))
        ])

        return el
    }

    triggerInsert() {
        api.editorSession.executeCommand('insert-factbox', {})
    }
}

export default FactBoxTool
