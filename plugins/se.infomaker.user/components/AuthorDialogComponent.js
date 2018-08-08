import {Component} from 'substance'
import {AuthorSuggestionComponent} from './AuthorSuggestionComponent'

class AuthorDialogComponent extends Component {

    render($$) {
        return $$('div').append(
            $$(AuthorSuggestionComponent, {
                ...this.props
            }).ref('author-suggestions')
        )
    }

    onClose() {
        return true
    }

}

export {AuthorDialogComponent}
