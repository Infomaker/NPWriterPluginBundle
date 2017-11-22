import { Component } from 'substance'
import ConceptSearchItemComponent from './ConceptSearchItemComponent'

class ConceptSearchResultComponent extends Component {

    render($$){
        const matches = this.props.searchResult.map((item, index) => {
            const selected = (index === this.props.selected)
            const itemExists = this.props.itemExists(item)

            return $$(ConceptSearchItemComponent, {
                item,
                selected,
                itemExists,
                scrollIntoView: this.scrollItemIntoView.bind(this)
            })
        })
        const el = $$('div')
            .addClass('concept-search-result-component')
            .append(matches)
            .ref('searchResultContainer')

        return el
    }

    scrollItemIntoView(item) {
        this.refs.searchResultContainer.el.el.scrollTop = item.el.el.offsetTop;
    }
}

export default ConceptSearchResultComponent
