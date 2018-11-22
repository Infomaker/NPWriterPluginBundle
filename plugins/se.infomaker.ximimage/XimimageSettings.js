import {Component} from 'substance'

class XimimageSettings extends Component {
    constructor(...args) {
        super(...args)
        this.displayModes = ['normal', 'slim', 'minimized']
    }

    render($$) {
        return $$('div', {class: ''}, [
            this.renderHeader($$),
            this.renderImageModeDropdown($$)
        ])
    }

    renderHeader($$) {
        return $$('h3', {class: 'clear'}, [
            this.getLabel('image-display-modes')
        ])
    }

    renderImageModeDropdown($$) {
        const DropdownComponent = this.context.api.ui.getComponent('DropdownComponent')
        const selectedDisplayMode = this.props.properties ? this.props.properties.imageDisplayMode : 'normal'
        return $$(DropdownComponent, {
            options: this.displayModes.map(displayMode => {
                return {
                    label: this.getLabel(`image-display-mode-${displayMode}`),
                    value: displayMode
                }
            }),
            onChangeList: (value) => { this.props.onChange('imageDisplayMode', value) },
            isSelected: (options, data) => { return data.value === selectedDisplayMode }
        })
    }
}

export default XimimageSettings
