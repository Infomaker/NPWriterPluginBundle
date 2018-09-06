import {Component} from 'substance'
import {api, ConceptService} from 'writer'

class AuthorSearchComponent extends Component {

    didMount() {
    }

    render($$) {

        const {email, family_name, given_name, picture, sub} = this.props

        ConceptService.searchForConceptSuggestions(['x-im/author'], `${given_name} ${family_name}`)
            .then((res) => {

            })


        return $$('div').append($$())
    }

}

export {AuthorSearchComponent}
