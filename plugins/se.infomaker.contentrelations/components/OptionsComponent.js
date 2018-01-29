import { Component } from 'substance'
import { api } from 'writer'

class OptionsComponent extends Component {

    constructor(...args) {
        super(...args)

        this.limits = [
            { label: '15', value: 15 },
            { label: '25', value: 25 },
            { label: '50', value: 50 },
            { label: '100', value: 100 }
        ]

        this.dropdownComponent = api.ui.getComponent('DropdownComponent')
    }

    /**
     * Create dropdown for sortings
     *
     * @param {object} $$ VirtualElement
     */
    renderSortingsDropDown($$) {
        return $$(this.dropdownComponent, {
            header: this.getLabel('Sort'),
            options: this.props.sortings.map(sorting => ({ label: sorting.name, value: sorting.field })),
            isSelected: (options, item) => item.value === this.props.sorting.field,
            onChangeList: (selected) => {
                const selectedSorting = this.props.sortings.find(sorting => sorting.field === selected)
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
        return $$(this.dropdownComponent, {
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
        const el = $$('div').addClass('content-options').ref('contentOptions')
        const nowShoing = $$('p')
            .append(`Visar ${this.props.displaying} av ${this.props.totalHits}`)
            .addClass('result-description')

        const infoWrapper = $$('div')
            .addClass('info-wrapper')
            .append(nowShoing)

        const selectSortings = this.renderSortingsDropDown($$)
        const selectLimit = this.renderLimitDropDown($$)

        return el.append(infoWrapper)
            .append(selectSortings)
            .append(selectLimit)
    }

}

export default OptionsComponent