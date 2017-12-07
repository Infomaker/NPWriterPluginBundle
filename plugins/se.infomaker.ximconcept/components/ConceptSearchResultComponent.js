import { Component } from 'substance'
import ConceptSearchItemComponent from './ConceptSearchItemComponent'

class ConceptSearchResultComponent extends Component {

    render($$){
        let createConcept
        const el = $$('div').addClass('concepts-search-result-wrapper')
        const matches = this.props.searchResult.map((item, index) => {
            const selected = (index === this.props.selected)
            const itemExists = this.props.itemExists(item)

            return $$(ConceptSearchItemComponent, {
                item,
                selected,
                itemExists,
                addItem: this.props.addItem,
                scrollIntoView: this.scrollItemIntoView.bind(this)
            }).on('mousedown', () => { this.props.addItem(item) })
        })

        if (this.props.editable && this.props.searchedTerm !== '*') {
            createConcept = $$('div').addClass('concept-create-wrapper')
                .append($$('i', { class: 'fa fa-plus concept-create-icon', 'aria-hidden': 'true' }))
                .append(`${this.getLabel('create')}: ${this.props.searchedTerm}`)
                .on('click', this.props.addItem)
        }

        const result = $$('div')
            .addClass('concept-search-result-component')
            .append(matches)
            .ref('searchResultContainer')

        return el.append(result).append(createConcept)
    }

    scrollItemIntoView(item) {
        this.refs.searchResultContainer.el.el.scrollTop = item.el.el.offsetTop;
    }
}

export default ConceptSearchResultComponent
