import {Component} from 'substance'
import {api} from 'writer'
import TimeLineComponent from './TimeLineComponent'

class ShowVersionsComponent extends Component {

    getInitialState() {
        return {
            history: api.history.getHistoryForArticle(this.props.article.id)
        }
    }

    render($$) {
        return $$('div').append(
            [
                $$(TimeLineComponent, {versions: this.state.versions}),
                $$('span').append(this.props.article.id),
                $$('span').append(":" + this.state.history.versions.length)
            ]
        )
    }

    onClose(status) {
        if ('cancel' === status) {
            return true
        }

        return false
    }
}


export default ShowVersionsComponent