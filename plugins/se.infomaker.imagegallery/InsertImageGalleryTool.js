import {Tool} from 'substance'
import {api} from 'writer'

class InsertImageGalleryTool extends Tool {
    render($$) {
        const icon = $$('i').addClass('fa fa-map-o')
        const button = $$('button').addClass('se-tool')
        const el = $$('div').attr('title', this.getLabel('Insert Image gallery'))
            .on('click', this.insertGallery)

        button.append(icon)
        el.append(button)

        return el
    }

    insertGallery() {
        const commandName = this.getCommandName()
        api.editorSession.executeCommand(commandName)
    }
}

export default InsertImageGalleryTool
