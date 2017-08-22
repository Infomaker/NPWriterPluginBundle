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
            list: this.getListFilledWithDefaultValues(this.options)
        }

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
                    list: this.state.list,
                    onChangeList: (list, selected) => this.onChangeList(list, selected),
                    onChangeToggleList: (list, selected) => this.onChangeToggleList(list, selected),
                    isSelected: (data) => this.isSelected(data)
                })
            )
    }


    /**
     * Fetches content-meta-link from newsml and reads 'title' field from link
     * Stores this value as 'defaultValue' to list if it exists as one of list values
     * (and for nested lists also, if available)
     *
     * @param list
     * @returns {*}
     */
    getListFilledWithDefaultValues(list) {
        /* Read '@title' from content meta link */
        const contentMetaLink = this.context.api.newsItem.getContentMetaLinkByType(list.link.uri, list.link.type)
        let linkTitle = ''
        if (contentMetaLink.length > 0 && contentMetaLink[0].hasOwnProperty('@title')) {
            linkTitle = contentMetaLink[0]['@title']
        }

        /* Store title as 'defaultValue' property in list */
        if (list.hasOwnProperty('defaultValue')) {
            delete list.defaultValue
        }

        for (let i = 0; i < list.values.length; i++) {
            const value = list.values[i]

            if (value.title === linkTitle) {
                list.defaultValue = linkTitle
            }

            /* Perform recursive filling of default values if nested list found */
            if (value.hasOwnProperty('list')) {
                value.list = this.getListFilledWithDefaultValues(value.list)
            }
        }

        return list
    }

    /**
     * Inserts contentMeta links to newsml (removes duplicates before inserting)
     *
     * @param link
     * @param option
     */
    addContentMetaLinkToNewsml(link, option) {
        this.context.api.newsItem.addContentMetaLink(option.uri, {
            '@rel': link.rel,
            '@title': option.title,
            '@type': link.type,
            '@uri': option.uri
        })
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
     * Event handler to manage insert/delete of contentMeta links when 'button' or 'dropdown' list changes
     * (handles changes in nested lists also, if available)
     *
     * @param selectedList The list being clicked on
     * @param selectedOption The option clicked in the list
     */
    onChangeList(selectedList, selectedOption) {
        this.clearContentMetaLinks(selectedList)
        this.addContentMetaLinkToNewsml(selectedList.link, selectedOption)

        if (selectedOption.hasOwnProperty('list')) {
            this.onChangeList(selectedOption.list, selectedOption.list.values[0])
        }
        else {
            this.setState({
                list: this.getListFilledWithDefaultValues(this.state.list)
            })
        }
    }

    /**
     * Event handler to manage insert/delete of contentMeta links when 'toggle' list changes
     *
     * @param selectedList The list being clicked on
     * @param selectedOption The option clicked in the list
     */
    onChangeToggleList(selectedList, selectedOption) {

        const existingLinks = this.context.api.newsItem.getContentMetaLinkByType(
            this.pluginName,
            selectedOption.type
        )

        let found = false
        for (let i = 0; i < existingLinks.length; i++) {
            if (existingLinks[i]["@uri"] === selectedOption.uri) {
                found = true
                break
            }
        }

        if (this.options.multivalue) {
            if (found) {
                this.context.api.newsItem.removeLinkContentMetaByTypeAndRel(
                    selectedOption.uri,
                    selectedOption.type || selectedList.link.type,
                    selectedOption.rel || selectedList.link.rel
                )
            }
            else {
                this.context.api.newsItem.addContentMetaLink(selectedOption.uri, {
                    '@rel': selectedOption.rel || selectedList.link.rel,
                    '@title': selectedOption.title,
                    '@type': selectedOption.type || selectedList.link.type,
                    '@uri': selectedOption.uri
                })
            }
        } else {
            this.clearContentMetaLinks(selectedList)
            if (!found) {
                this.context.api.newsItem.addContentMetaLink(selectedOption.uri, {
                    '@rel': selectedOption.rel || selectedList.link.rel,
                    '@title': selectedOption.title,
                    '@type': selectedOption.type || selectedList.link.type,
                    '@uri': selectedOption.uri
                })
            }
        }

        this.setState({
            list: this.getListFilledWithDefaultValues(this.state.list)
        })

    }

    /**
     * Responsible for reporting whether a specific list data element is selected or not
     *
     * @param data The element to check
     * @return True if selected, false otherwise
     */
    isSelected(data) {
        const selectedItems = this.context.api.newsItem.getContentMetaLinkByType(this.pluginName, data.type)
        for (let i = 0; i < selectedItems.length; i++) {
            if (selectedItems[i]["@uri"] === data.uri) {
                return true;
            }
        }
        return false;
    }
}

export default OptionsComponent
