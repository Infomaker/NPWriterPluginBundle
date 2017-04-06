import {Component} from "substance"
import {api} from "writer"
import ToggleComponent from "./ToggleComponent"

class ArticleOptionsComponent extends Component {

    /**
     * Setup config for plugin
     */
    setupConfig() {
        this.pluginName = 'artilceoptions'
        this.options = this.context.api.getConfigValue(
            'se.infomaker.articleoptions',
            'options'
        )
    }

    /**
     * Initial state
     */
    getInitialState() {
        this.setupConfig()
    }

    /**
     * Render options
     *
     * @param $$
     * @returns {*}
     */
    renderOptions($$) {
        const optionGroupDiv = $$('div').addClass('option-group-' + this.pluginName)

        Object.keys(this.options).forEach((option) => {

            const toggleBtn = $$(ToggleComponent, {
                option: this.options[option],
                pluginName: this.pluginName
            })

            optionGroupDiv.append(toggleBtn)
        })

        return optionGroupDiv
    }

    /**
     * Render plugin
     *
     * @param $$
     * @returns {*}
     */
    render($$) {
        const el = $$('div').addClass('im-' + this.pluginName),
            label = $$('h2').append(this.getLabel('articleoptions-label')),
            btns = this.renderOptions($$)

        el.append(label)
            .append(btns)

        return el
    }
}

export default ArticleOptionsComponent