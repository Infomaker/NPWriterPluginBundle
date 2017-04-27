import {Component, FontAwesomeIcon} from 'substance'

class DropDownHeadline extends Component {

    getInitialState() {
        return {
            showInlineTextMenu: false
        }
    }

    render($$) {
        const isolatedNode = this.props.isolatedNodeComponent
        const el = $$('span').addClass('drop-down-headline-wrapper')
        const current = this.getCurrent($$)
        const icon = $$(FontAwesomeIcon, {icon: this.props.icon})
        const items = this.props.items

        if (items && items.length > 0) {
            const clickableDropdown = $$('span')

            if (items.length > 1) {
                clickableDropdown.addClass('clickable-drown-down')
                    .on('click', this.toggleDropDown.bind(this))
                    .append([
                        current,
                        icon
                    ])
            } else if (items.length === 1) {
                clickableDropdown.append(current)
            }

            el.append(clickableDropdown)

            if (this.state.showInlineTextMenu && isolatedNode.isFocused()) {
                el.append(this.renderDropDown($$))
            }
        } else {
            el.append($$('span').append(this.content.api.getConfigValue('se.infomaker.contentpart', 'standaloneDefault', 'Unknown')))
        }

        // If we loose focus we need to reset showInlineTextMenu
        if (this.state.showInlineTextMenu && !isolatedNode.isFocused()) {
            if (!this.__isRendering__) {
                this.extendState({
                    showInlineTextMenu: false
                })
            }

        }
        return el;
    }


    toggleDropDown() {
        const isolatedNode = this.props.isolatedNodeComponent
        isolatedNode.addClass('sm-focused')
        this.extendState({
            showInlineTextMenu: !this.state.showInlineTextMenu
        })
        isolatedNode.setState({
            mode: "focused",
            unblocked: true
        })
    }

    getSelectedContentPartName() {
        let selectedInlineTextName
        this.props.items.forEach((inlineText) => {
            if (this.props.node.contentpartUri && this.props.node.contentpartUri === inlineText.uri) {
                selectedInlineTextName = inlineText.name
            } else if (!this.props.node.contentpartUri && inlineText.default) {
                selectedInlineTextName = inlineText.name
            }
        })
        if (selectedInlineTextName) {
            return selectedInlineTextName
        } else {
            console.error('Invalid configuration of plugin. Missing default inline-texts in configuration')
        }
    }

    renderDropDown($$) {
        const list = $$('ul').addClass('available-content-part__list')

        const inlineTextElements = this.props.items.map((text) => {
            const listItem = $$('li')
                .on('click', () => {
                    this.props.change(text)
                })
                .append(text.name)
            if(this.getSelectedContentPartName() === text.name) {
                listItem.addClass('active')
            }
            return listItem
        })

        list.append(inlineTextElements)
        return list
    }

    /**
     * Renders the current choosen content part and handles the click
     * @param $$
     */
    getCurrent($$) {
        return $$('span')
            .append(this.getSelectedContentPartName())
    }

}
export default DropDownHeadline