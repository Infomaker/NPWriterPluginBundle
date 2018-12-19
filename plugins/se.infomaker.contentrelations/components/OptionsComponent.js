import { Component } from 'substance'
import { api, UIDropdown } from 'writer'

class OptionsComponent extends Component {

    constructor(...args) {
        super(...args)

        this.limits = [
            { label: '25', value: 25 },
            { label: '50', value: 50 },
            { label: '100', value: 100 }
        ]
    }

    /**
     * Create dropdown for sortings
     *
     * @param {object} $$ VirtualElement
     */
    renderSortingsDropDown($$) {
        return $$(UIDropdown, {
            header: this.getLabel('Sort'),
            options: this.props.sortings.map(sorting => ({ label: sorting.name, value: `${sorting.name}:${sorting.field}`, data: {} })),
            isSelected: (options, item) => {
                return (item.label === this.props.sorting.name && item.value === `${this.props.sorting.name}:${this.props.sorting.field}`)
            },
            onChangeList: (selected) => {
                const selectedSorting = this.props.sortings.find(sorting => `${sorting.name}:${sorting.field}` === selected)
                this.props.setSorting(selectedSorting)
            },
            disabled: this.props.sortings.length <= 1
        }).ref('sortingsDropDown')
    }

    /**
     * Create dropdown for limits
     *
     * @param {object} $$ VirtualElement
     */
    renderLimitDropDown($$) {
        return $$(UIDropdown, {
            header: this.getLabel('Show'),
            options: this.limits,
            isSelected: (options, item) => item.value === this.props.limit,
            onChangeList: (selected) => {
                const selectedLimit = this.limits.find(limit => limit.value === selected)
                this.props.setLimit(selectedLimit.value)
            }
        }).ref('limitDropDown')
    }

    render($$){
        return $$('div', { class: 'content-options'}, [
            $$('div', { class: 'info-wrapper'}, [
                $$('p', { class: 'result-description'}, `Visar ${this.props.displaying} av ${this.props.totalHits}`)
            ]),
            this.renderSortingsDropDown($$),
            this.renderLimitDropDown($$)
        ]).ref('contentOptions')
    }

}

export default OptionsComponent
