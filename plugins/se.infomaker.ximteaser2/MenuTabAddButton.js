import {Component, FontAwesomeIcon} from 'substance'

class MenuTabAddButton extends Component {


    render($$) {

        if(this.props.items.length === 0) {
            return $$('span')
        }
        const item = $$('li').append($$(FontAwesomeIcon, {icon: 'fa-plus'}))

        const dropdown = $$('ul')
        const dropdownItems = this.props.items.map((item) => {
            return $$('li').append(item.label).on('click', () => {
                this.props.add(item)
            })
        })
        dropdown.append(dropdownItems)

        item.append(dropdown)
        return item
    }
}

export default MenuTabAddButton