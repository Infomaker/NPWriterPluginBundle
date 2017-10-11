import {Component, FontAwesomeIcon} from 'substance'

class MenuTabAddButton extends Component {

    getInitialState() {
        return {
            dropdownActive: false
        }
    }

    render($$) {
        if (this.props.items.length === 0) {
            return $$('span')
        }

        const plusIcon = $$(FontAwesomeIcon, {icon: 'fa-plus'})
        const addText = $$('span').append(` ${this.getLabel('Add new teaser')}`)
        const item = $$('li')
            .addClass('add-teaser__button')
            .append([plusIcon, addText])
            .on('click', (e) => {
                e.stopPropagation()
                this.setState({
                    dropdownActive: !this.state.dropdownActive
                })
            })

        if (this.state.dropdownActive) {
            const dropdown = $$('ul').addClass('add-teaser__dropdown-list shaded-box')
            const dropdownItems = this.props.items.map((item) => {
                const teaserIcon = $$(FontAwesomeIcon, {icon: item.icon})
                return $$('li')
                    .append([teaserIcon, item.label])
                    .on('click', () => {
                        this.props.add(item)
                    })
            })
            dropdown.append(dropdownItems)

            item.append(dropdown)
        }

        return item
    }
}

export default MenuTabAddButton