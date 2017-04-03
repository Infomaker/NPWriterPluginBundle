import {Tool} from 'substance'
import {api} from 'writer'

class ArticlePartTool extends Tool {
    render($$) {
        let el = $$('div');

        el.append([
            $$('button').attr('title', this.getLabel('Add article part')).addClass('se-tool').append(
                $$('i').addClass('fa fa-bullhorn')
            ).on('click', this.triggerInsert.bind(this))
        ])

        return el
    }

    triggerInsert() {
        api.editorSession.executeCommand('insert-articlepart', {})
    }
}

export default ArticlePartTool
