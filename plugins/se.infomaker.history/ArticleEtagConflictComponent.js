import {Component} from 'substance'
import {api} from 'writer'

class ArticleEtagConflictComponent extends Component {

    render($$) {

        return $$('div')
            .addClass('showConflict')
            .append([
                $$('h1').append(this.getLabel('se.infomaker.history-conflict.header')),
                $$('p').append(this.getLabel('se.infomaker.history-conflict.text'))
            ])
    }

    onClose(action) {

        if (action === 'save') {
            window.location.href = api.article.getUrl(this.props.article.id)
            window.location.reload(true)
        }

        return true
    }

}

export default ArticleEtagConflictComponent