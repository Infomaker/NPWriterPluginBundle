import {Tool} from 'substance'
import {api} from 'writer'

class InsertTableTool extends Tool {
    render($$) {
        return $$('div', {title: this.getLabel('table-insert')}, [
            $$('button', {class: 'se-tool'}, [
                $$('i', {class: 'fa fa-table'})
            ]).on('click', this.triggerInsert.bind(this))
        ])
    }

    triggerInsert() {
        api.editorSession.executeCommand('InsertTable', {
            tableSize: [10, 10]
        })
    }
}

export default InsertTableTool
