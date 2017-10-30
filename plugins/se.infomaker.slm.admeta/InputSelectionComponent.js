import { Component } from 'substance'

class InputSelectionComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'admeta'
    }

    render($$) {

        let style = ''

        if (!this.props.inputValue) {
            style = 'display:none;'
        }

        const el = $$('div').attr('style', style).addClass('input-selection').append([
            $$('span').append('Lägg till: '),
            $$('span').append(this.props.inputValue)
        ]).on('click', this.props.onSelect)

        return el
    }
}

export default InputSelectionComponent
