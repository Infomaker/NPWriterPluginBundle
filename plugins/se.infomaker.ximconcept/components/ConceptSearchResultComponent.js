import { Component } from 'substance'
import ConceptSearchItemComponent from './ConceptSearchItemComponent'

class ConceptSearchResultComponent extends Component {

    constructor(...args) {
        super(...args)

        this.scrollItemIntoView = this.scrollItemIntoView.bind(this)
    }

    render($$){
        let createConcept
        const { propertyMap, icon, addItem, enableHierarchy } = this.props
        const matches = this.props.searchResult.map((item, index) => {
            const selected = (index === this.props.selected)
            const itemExists = this.props.itemExists(item)

            return $$(ConceptSearchItemComponent, {
                item,
                selected,
                itemExists,
                propertyMap,
                addItem,
                icon,
                enableHierarchy,
                scrollIntoView: this.scrollItemIntoView
            }).ref(`concept-search-result-item-${item.uuid}`).on('mousedown', () => { this.props.addItem(item) })
        })

        if (this.props.creatable && this.props.searchedTerm !== '*' && !this.props.isPolygon && !this.props.searching) {
            createConcept = $$('div', { class: 'concept-create-wrapper' }, [
                $$('i', { class: 'fa fa-plus concept-create-icon', 'aria-hidden': 'true' }),
                `${this.getLabel('create')}: ${this.props.searchedTerm}`
            ]).on('mousedown', this.props.addItem)
        }

        return $$('div', { class: 'concepts-search-result-wrapper' }, [
            $$('div', { class: 'concept-search-result-component' }, [
                ...matches
            ]).ref('searchResultContainer'),
            createConcept
        ]).ref(`concepts-search-result-wrapper`)
    }

    scrollItemIntoView(item) {
        this.refs.searchResultContainer.el.el.scrollTop = item.el.el.offsetTop;
    }
}

export default ConceptSearchResultComponent
