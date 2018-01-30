import {Component} from 'substance'
import SearchResultItem from './SearchResultItemComponent'

class SearchResultComponent extends Component {

    render($$) {
        const items = this.props.results.map(item => {
            return $$(SearchResultItem, { item, ...this.props })
                .ref(`searchResultItem-${item.id}`)
        })

        return $$('div', { class: 'search-result-list'}, [
            ...items
        ]).ref('searchResultComponent')
    }
}

export default SearchResultComponent
