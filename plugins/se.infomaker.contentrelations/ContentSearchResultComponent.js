// var Icon = require('substance/ui/FontAwesomeIcon');
// var Image = require('./ImageComponent');
// var RelationsCommand = require('./ContentRelationsCommand');

import {Component} from 'substance'
import SearchResultItem from './SearchResultItem'

class ContentSearchResultComponent extends Component {

    render($$) {
        const el = $$('ul').addClass('search__results');
        const items = this.props.results.map(function (item) {

            return $$(SearchResultItem, {item: item})

        })

        el.append(items)
        return el
    }
}

export default ContentSearchResultComponent