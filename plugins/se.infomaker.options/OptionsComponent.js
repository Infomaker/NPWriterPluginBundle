import {Component} from "substance"
import {api} from "writer"

class OptionsComponent extends Component {

    /**
     * Initial state
     */
    getInitialState() {
        this.pluginName = 'options'
        this.options = this.props.pluginConfigObject.pluginConfigObject.data.options

        return {
            list: this.options
        }
    }

    render($$) {
        const SelectComponent = api.ui.getComponent('select')

        return $$('div')
            .append(
                $$(SelectComponent, {
                    list: this.state.list,
                    onChangeList: this.onChangeList.bind(this),
                    isSelected: this.isSelected.bind(this)
                })
            )
    }


    /**
     * Removes earlier selected options as well as selected sub options
     * @param list
     */
    clearContentMetaLinks(list) {
        const existingLinks = this.context.api.newsItem.getContentMetaLinkByType(
            this.pluginName,
            list.link.type
        )

        if (existingLinks.length > 0) {
            this.context.api.newsItem.removeLinkContentMetaByTypeAndRel(
                this.pluginName,
                list.link.type,
                list.link.rel
            )
        }

        if (!Array.isArray(list.values)) {
            console.warn('Received list contains no values')
            return
        }

        for (let n = 0; n < list.values.length; n++) {
            if (list.values[n].list) {
                this.clearContentMetaLinks(list.values[n].list)
            }
        }
    }

    /**
     * Event handler to manage insert/delete of contentMeta links when 'toggle' list changes
     *
     * @param selectedList The list being clicked on
     * @param selectedOption The option clicked in the list
     */
    onChangeList(selectedList, selectedOption) {

        const existingLinks = this.context.api.newsItem.getContentMetaLinkByType(
            this.pluginName,
            selectedOption.type || selectedList.link.type
        )

        let found = false
        for (let i = 0; i < existingLinks.length; i++) {
            if (existingLinks[i]["@uri"] === selectedOption.uri) {
                found = true;
                break;
            }
        }

        if (selectedList.multivalue || (selectedList.multivalue === undefined && this.options.multivalue)) {

            if (found) {
                this.context.api.newsItem.removeLinkContentMetaByTypeAndMatchingFilter(
                    this.pluginName,
                    selectedList.link.type,
                    (link) => link.getAttribute('uri') === selectedOption.uri
                )

                if (selectedOption.list && selectedOption.list.link && selectedOption.list.link.type) {

                    // Remove children for removed elements
                    this.context.api.newsItem.removeLinkContentMetaByTypeAndMatchingFilter(
                        this.pluginName,
                        selectedOption.list.link.type,
                        () => true
                    )
                }
            }
            else {

                if (selectedOption.label === true) {
                    return
                }

                this.context.api.newsItem.addContentMetaLink(this.pluginName, {
                    '@rel': selectedOption.rel || selectedList.link.rel,
                    '@title': selectedOption.title,
                    '@type': selectedOption.type || selectedList.link.type,
                    '@uri': selectedOption.uri
                })
            }
        } else {
            this.clearContentMetaLinks(selectedList)

            if (selectedOption.label === true) {
                return
            }

            if (!found) {
                this.context.api.newsItem.addContentMetaLink(this.pluginName, {
                    '@rel': selectedOption.rel || selectedList.link.rel,
                    '@title': selectedOption.title,
                    '@type': selectedOption.type || selectedList.link.type,
                    '@uri': selectedOption.uri
                })
            }
        }

        this.setState({
            list: this.state.list
        })

    }

    /**
     * Responsible for reporting whether a specific list data element is selected or not
     *
     * @param data The element to check
     * @return True if selected, false otherwise
     */
    isSelected(list, data) {

        const listType = (list && list.link && list.link.type) ? list.link.type : undefined

        const selectedItems = this.context.api.newsItem.getContentMetaLinkByType(this.pluginName, listType || this._getLinkType())

        for (let i = 0; i < selectedItems.length; i++) {
            if (selectedItems[i]["@uri"] === data.uri) {
                return true;
            }
        }
        return false;
    }

    _getLinkType() {
        return this.state.list.link.type
    }
}

export default OptionsComponent
