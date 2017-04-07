import {Component} from "substance"
import {api} from "writer"

class ToggleComponent extends Component {

    /**
     * Setup config for plugin
     */
    setupConfig() {
        this.pluginName = this.props.pluginName // Parent plugin name
        this.linkType = this.props.option.type.toLocaleLowerCase()
        this.linkRel = this.props.option.rel.toLocaleLowerCase()
        this.linkUri = this.props.option.uri.toLocaleLowerCase() + '/'
    }

    /**
     * Initial state
     *
     * @returns {{gender: string}}
     */
    getInitialState() {
        this.setupConfig()

        const existingOption = api.newsItem.getContentMetaLinkByType(this.pluginName, this.linkType)

        return {
            'checked': (existingOption && existingOption.length > 0)
        }
    }

    saveMeta(toggle) {
        // Uncheck and remove
        if (this.state.checked) {
            api.newsItem.removeLinkContentMetaByTypeAndRel(this.pluginName, this.linkType, this.linkRel)
            this.extendState({
                checked: false
            })
            return
        }

        const link = {
            '@title': toggle.label,
            '@uri': this.linkUri + toggle.id,
            '@rel': this.linkRel,
            '@type': this.linkType
        }

        // Add new value
        api.newsItem.addContentMetaLink(this.pluginName, link)

        this.extendState({
            checked: !this.state.checked
        })
    }

    /**
     * Render plugin
     *
     * @param $$
     * @returns {*}
     */
    render($$) {
        const props = this.props.option,
            toggleGroup = $$('div').addClass('toggle-btn-wrapper'),
            fakeLabel = $$('span').addClass('toggle-btn-fake-label')
                .append(props.label)
                .on('click', () => {
                    this.saveMeta(props)
                }),
            label = $$('label').setAttribute('for', props.id)
                .addClass('toggle-btn-label')
                .on('click', (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.saveMeta(props)
                }),
            checkBox = $$('input').setAttribute('type', 'checkbox')
                .addClass('toggle-btn')
                .setAttribute('id', props.id)

        if (this.state.checked) {
            checkBox.setAttribute('checked', 'checked')
        } else {
            checkBox.removeAttribute('checked')
        }

        toggleGroup.append(checkBox)
            .append(label)
            .append(fakeLabel)

        return toggleGroup
    }
}

export default ToggleComponent