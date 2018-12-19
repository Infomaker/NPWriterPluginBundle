import {Component} from 'substance'
import {UIDropdown} from 'writer'

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
        const selectedDisplayMode = this.props.properties ? this.props.properties.imageDisplayMode : 'normal'
        return $$(UIDropdown, {
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
