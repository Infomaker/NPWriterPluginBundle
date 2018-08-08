import {Component} from 'substance'
import {ConceptService} from 'writer'

class AuthorSuggestionComponent extends Component {

    didMount() {
        const {email, family_name, given_name, picture, sub} = this.props
        ConceptService.searchForConceptSuggestions(['x-im/author'], `${given_name} ${family_name}`)
            .then((res) => {
                this.extendState({
                    suggestions: res
                })
            })
    }

    getInitialState() {
        return {
            suggestions: []
        }
    }

    render($$) {

        const {suggestions} = this.state

        if(suggestions.length) {
            return $$('ul').append(
                suggestions.map((suggestion) => {
                    return $$('li').append('yes')
                })
            )
        }

        return $$('div')
    }
}

export {AuthorSuggestionComponent}
