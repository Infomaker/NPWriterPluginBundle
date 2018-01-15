import { Component } from 'substance'
import { api } from 'writer'

class ContentOptionsComponent extends Component {

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

    renderSortingsDropDown($$) {
        return $$(this.dropdownComponent, {
            header: this.getLabel('Sort'),
            options: this.props.sortings.map(sorting => ({ label: sorting.name, value: sorting.field })),
            isSelected: (options, item) => item.value === this.props.sorting.field,
            onChangeList: (selectedSorting) => {
                this.props.setSorting(selectedSorting)
            },
            disabled: this.props.sortings.length <= 1
        })
    }

    renderLimitDropDown($$) {
        return $$(this.dropdownComponent, {
            header: this.getLabel('Show'),
            options: this.limits,
            isSelected: (options, item) => item.value === this.props.limit,
            onChangeList: (selectedLimit) => {
                this.props.setLimit(selectedLimit.value)
            }
        })
    }

    render($$){
        const el = $$('div').addClass('content-options')
        const nowShoing = $$('p')
            .append(`Visar ${this.props.displaying} av ${this.props.totalhits}`)
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

export default ContentOptionsComponent