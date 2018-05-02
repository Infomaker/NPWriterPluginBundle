import '../scss/ui-options.scss'
import {Component} from 'substance'

import OptionComponent from './OptionComponent'

/**
 * @class OptionsComponent
 */
class OptionsComponent extends Component {

    constructor(...args) {
        super(...args)
        this.onOptionSelected = this.onOptionSelected.bind(this)

        this.extendState({
            optionsState: this.options.reduce((arr, option) => {
                arr[option[this.optionIdentifier]] = Boolean(option.default || this.props.selectedOptions.includes(option[this.optionIdentifier]))
                return arr
            }, [])
        })
    }

    getInitialState() {
        return {
            optionsState: []
        }
    }

    render($$) {
        return $$('div').addClass('np-ui-options').append(
            ...this.options.map((option) => this.renderOption($$, option))
        )
    }

    renderOption($$, option) {
        return $$(OptionComponent, {
            option,
            selected: this._stateForOption(option),
            softDisable: !this.multiValue && this.anyOptionSelected,
            onOptionSelected: this.onOptionSelected
        })
    }

    onOptionSelected(option, selected) {
        this._mutateOptionState(option, selected)

        const {onClick} = this.props
        return onClick && onClick(this.selectedOptions)
    }

    _mutateOptionState(option, selected) {
        let {optionsState} = this.state
        if (!this.multiValue && selected) {
            optionsState = optionsState.map(() => false)
        }
        optionsState[option[this.optionIdentifier]] = selected

        this.extendState({
            optionsState
        })
    }

    _stateForOption(option){
        const {optionsState} = this.state
        return optionsState[option[this.optionIdentifier]]
    }

    get optionIdentifier() {
        const {identifier} = this.props
        return identifier
    }

    get multiValue() {
        const {multiValue} = this.props
        return Boolean(multiValue)
    }

    get anyOptionSelected() {
        const {optionsState} = this.state
        return Object.values(optionsState).some(selected => selected)
    }

    get options() {
        const {options} = this.props
        return options || []
    }

    get selectedOptions() {
        return this.options.filter((option) => this._stateForOption(option))
    }
}

export default OptionsComponent
