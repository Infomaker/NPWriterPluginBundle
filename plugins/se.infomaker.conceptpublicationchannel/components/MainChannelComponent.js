import { Component } from 'substance'
import { api } from 'writer'

class MainChannelComponent extends Component {

    constructor(...args) {
        super(...args)

        this.dropdownComponent = api.ui.getComponent('DropdownComponent')
    }

    /**
     * Create dropdown for Main channel
     *
     * @param {object} $$ VirtualElement
     */
    renderChannelsDropDown($$) {
        return $$(this.dropdownComponent, {
            header: this.getLabel('publication-main-channel'),
            options: this.props.channels.map(sorting => ({ label: sorting.name, value: `${sorting.name}:${sorting.field}`, data: {} })),
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

    render($$){
        return $$('div', { class: 'main-channel-component' }, [
            $$('p', { class: 'main-channel-title' }, this.getLabel('publication-main-channel'))
        ])
    }

}

export default MainChannelComponent