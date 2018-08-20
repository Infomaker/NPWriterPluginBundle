import { Tool } from 'substance'
import { api } from 'writer'

class InsertImageGalleryTool extends Tool {

    constructor(...args) {
        super(...args)

        this.insertOrderedList = this.insertOrderedList.bind(this)
        this.insertUnorderedList = this.insertUnorderedList.bind(this)
    }

    render($$) {
        return $$('div', {}, [
            $$('button', { class: 'se-tool', title: this.getLabel('toggle-ordered-list') }, [
                $$('i', { class: 'fa fa-list-ol' })
            ]).on('click', this.insertOrderedList),
            $$('button', { class: 'se-tool', title: this.getLabel('toggle-unordered-list') }, [
                $$('i', { class: 'fa fa-list-ul' })
            ]).on('click', this.insertUnorderedList)
        ])
    }

    insertOrderedList() {
        api.editorSession.executeCommand('toggle-ordered-list', {
            spec: { listType: 'order' },
            commandGroup: 'list'
        })
    }

    insertUnorderedList() {
        api.editorSession.executeCommand('toggle-unordered-list', {
            spec: { listType: 'bullet' },
            commandGroup: 'list'
        })
    }
}

export default InsertImageGalleryTool
