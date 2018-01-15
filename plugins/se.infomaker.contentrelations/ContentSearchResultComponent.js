import {Component} from 'substance'
import SearchResultItem from './SearchResultItem'

class ContentSearchResultComponent extends Component {

    render($$) {
        const items = this.props.results.map(item => $$(SearchResultItem, {item}))

        const el = $$('ul')
            .addClass('list')
            .append(items)

        return el
    }
}

export default ContentSearchResultComponent