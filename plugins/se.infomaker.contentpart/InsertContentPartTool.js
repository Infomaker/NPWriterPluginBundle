import {Tool} from 'substance'
import {api} from 'writer'

class InsertContentPartTool extends Tool {
    render($$) {
        let el = $$('div');

        el.append([
            $$('button').attr('title', this.getLabel('Add content part')).addClass('se-tool').append(
                $$('i').addClass('fa fa-bullhorn')
            ).on('click', this.triggerInsert.bind(this))
        ])

        return el
    }

    triggerInsert() {
        api.editorSession.executeCommand('insert-contentpart', {})
    }
}

export default InsertContentPartTool
