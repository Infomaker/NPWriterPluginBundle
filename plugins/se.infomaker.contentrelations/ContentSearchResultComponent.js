import {Component} from 'substance'
import SearchResultItem from './SearchResultItem'

class ContentSearchResultComponent extends Component {

    render($$) {
        const el = $$('div').addClass('im-cr-container');

        const items = this.props.results.map(function (item) {
            return $$(SearchResultItem, {item: item})
        })

        el.append(items)

        return el
    }
}

export default ContentSearchResultComponent
