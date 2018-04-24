import {Component} from 'substance'

/**
 * @class OptionComponent
 */
class OptionComponent extends Component {
    
    render($$) {
        const {selected, option, onOptionSelected, softDisable} = this.props

        const element = $$('div', {
            'class': `option${selected ? ' selected' : ''}`
        }).append(
            $$('span', {'class': 'label'}).append(option.label)
        ).on('click', () => onOptionSelected(option, !selected))

        if (softDisable) {
            element.addClass('soft-disable')
        }

        return element
    }
}

export default OptionComponent
