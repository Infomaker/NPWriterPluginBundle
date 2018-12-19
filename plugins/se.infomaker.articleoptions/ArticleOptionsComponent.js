import {Component} from "substance"
import {api, UIToggle} from "writer"

class ArticleOptionsComponent extends Component {

    /**
     * Initial state
     */
    getInitialState() {
        this.pluginName = 'articleoptions'
        this.options = this.context.api.getConfigValue(
            'se.infomaker.articleoptions',
            'options'
        )

        Object.keys(this.options).forEach(id => {
            const links = api.newsItem.getContentMetaLinkByType(
                this.pluginName,
                this.options[id].type
            )

            this.options[id].checked = (links && links.length > 0)
        })
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

    /**
     * Render options
     *
     * @param $$
     * @returns {*}
     */
    renderOptions($$) {
        const optionGroupDiv = $$('div').addClass('option-group-' + this.pluginName)

        Object.keys(this.options).forEach((id) => {
            const option = this.options[id]
            optionGroupDiv.append(
                $$(UIToggle, {
                    id: id,
                    label: option.label,
                    checked: option.checked,
                    onToggle: (checked) => {
                        option.checked = checked
                        this.updateMetadata(option)
                    }
                })
            )
        })

        return optionGroupDiv
    }

    updateMetadata(option) {
        try {
            if (!option.checked) {
                this.removeMetadataLink(option)
            }
            else {
                this.addMetadataLink(option)
            }
        }
        catch(err) {
            console.error(err)
        }
    }

    removeMetadataLink(option) {
        api.newsItem.removeLinkContentMetaByTypeAndRel(
            this.pluginName,
            option.type,
            option.rel
        )
    }

    addMetadataLink(option) {
        api.newsItem.addContentMetaLink(
            this.pluginName,
            {
                '@title': option.label,
                '@uri': option.uri + '/' + option.id,
                '@rel': option.rel,
                '@type': option.type
            }
        )
    }
}

export default ArticleOptionsComponent
