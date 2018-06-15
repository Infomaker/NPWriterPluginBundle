import {Component} from "substance"
import {api, event} from "writer"

class OptionsComponent extends Component {

    didMount() {
        api.events.on(
            this.props.pluginConfigObject.id,
            event.DOCUMENT_CHANGED_EXTERNAL,
            (event) => {
                if (event.data.key === 'contentMetaLink') {
                    this.rerender()
                }
            })
    }

    dispose() {
        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL)
    }

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

        return $$('div').append(
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

        const multivalue = this.isMultivalue(selectedList)

        // If the list is not multivalue we want to clear the other
        // meta links so that multiple options aren't selected
        if (!multivalue) {
            this.clearContentMetaLinks(selectedList)
        }

        // Enables toggling a value if the list is multivalue
        if (multivalue && found) {
            this.removeContentMetaLink(selectedList, selectedOption)
        }

        // Add the content meta link for the provided option
        if (!found) {
            this.addContentMetaLink(selectedList, selectedOption)
        }

        this.extendState({
            list: this.state.list
        })

    }

    removeContentMetaLink(list, option) {
        this.context.api.newsItem.removeLinkContentMetaByTypeAndMatchingFilter(
            this.pluginName,
            list.link.type,
            (link) => link.getAttribute('uri') === option.uri
        )

        const childList = option.list
        if (childList && childList.link && childList.link.type) {
            // Remove children for removed elements
            this.context.api.newsItem.removeLinkContentMetaByTypeAndMatchingFilter(
                this.pluginName,
                childList.link.type,
                () => true
            )
        }
    }

    addContentMetaLink(list, option) {
        this.context.api.newsItem.addContentMetaLink(this.pluginName, {
            '@rel': option.rel || list.link.rel,
            '@title': option.title,
            '@type': option.type || list.link.type,
            '@uri': option.uri
        })

        const childList = option.list
        if (childList && childList.type === 'dropdown' && childList.values.length) {
            this.onChangeList(childList, childList.values[0])
        }
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

    isMultivalue(list) {
        if (list.type === 'dropdown') {
            return false
        }
        return list.multivalue || (list.multivalue === undefined && this.options.multivalue)
    }
}

export default OptionsComponent
