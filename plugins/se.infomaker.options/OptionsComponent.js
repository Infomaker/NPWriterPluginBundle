import {Component} from "substance"
import {api} from "writer"

class OptionsComponent extends Component {

    /**
     * Initial state
     */
    getInitialState() {
        this.pluginName = 'options'
        this.options = this.props.pluginConfigObject.pluginConfigObject.data.options

        // this.options = this.context.api.getConfigValue(
        //     this.props.pluginConfigObject.id,
        //     'options'
        // )
    }

    render($$) {
        const SelectComponent = api.ui.getComponent('select')

        return $$('div')
        .append(
            $$(SelectComponent, {
                list: this.options
            })
        )
    }

}

export default OptionsComponent
