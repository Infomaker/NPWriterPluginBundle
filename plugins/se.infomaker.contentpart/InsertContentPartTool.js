import {Tool} from 'substance'
import {api} from 'writer'

class InsertContentPartTool extends Tool {
    render($$) {
        let el = $$('div')
            .attr('title', this.getLabel('Add content part'))

        el.append([
            $$('button')
                .addClass('se-tool').append(
                    $$('i')
                        .addClass('fa fa-bullhorn')
                )
                .on('click', this.triggerInsert.bind(this))
        ])

        return el
    }

    triggerInsert() {
        api.editorSession.executeCommand('insert-contentpart', {})
    }
}

export default InsertContentPartTool
