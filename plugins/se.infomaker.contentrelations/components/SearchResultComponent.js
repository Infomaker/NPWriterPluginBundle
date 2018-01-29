import {Component} from 'substance'
import SearchResultItem from './SearchResultItemComponent'

class SearchResultComponent extends Component {

    render($$) {
        const items = this.props.results.map(item => {
            return $$(SearchResultItem, { item, ...this.props })
                .ref(`searchResultItem-${item.id}`)
        })

        const el = $$('div')
            .addClass('search-result-list')
            .append(items)
            .ref('searchResultComponent')

        return el
    }
}

export default SearchResultComponent
