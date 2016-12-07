import {Component, FontAwesomeIcon} from 'substance'
import {jxon, lodash as _} from 'writer'
import StoryEditComponent from './StoryEditComponent'

class StoryItemComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximstory'
    }

    loadTag() {
        this.context.api.router.getConceptItem(this.props.item.uuid, this.props.item.type)
            .then(xml => {
                const conceptXML = xml.querySelector('conceptItem')
                const conceptItemJSON = jxon.build(conceptXML)
                this.extendState({
                    loadedItem: conceptItemJSON,
                    isLoaded: true
                })
            })
            .catch(() => {
                this.extendState({
                    couldNotLoad: true,
                    isLoaded: true
                })
            })
    }


    render($$) {
        const item = this.props.item

        const tagItem = $$('li').addClass('tag-list__item').ref('tagItem').attr('title', 'Story')
        const displayNameEl = $$('span')
        let displayName

        if (!this.state.isLoaded) {
            this.loadTag()
        } else {
            if (this.state.couldNotLoad) {
                displayNameEl.addClass('tag-item__title  tag-item__title--no-avatar tag-item__title--notexisting')
                    .append(item.title)
                    .attr('title', this.getLabel('ximstory-could_not_load_uuid') + item.uuid)
                displayName = item.title
            } else {
                displayName = this.state.loadedItem.concept.name
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar').append(displayName)
                displayNameEl.on('click', () => {
                    this.showStory(displayName)
                })
            }

            displayNameEl.attr('title', displayName)
            this.updateTagItemName(displayNameEl, this.state.loadedItem)

            displayNameEl.attr('data-toggle', 'tooltip')
                .attr('data-placement', 'bottom')
                .attr('data-trigger', 'manual')

            // TODO Tooltip
            // displayNameEl.on('mouseenter', this.toggleTooltip)
            // displayNameEl.on('mouseout', this.hideTooltip)

            tagItem.append(displayNameEl)

            const deleteButton = $$('span').append($$(FontAwesomeIcon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.getLabel('ximstory-remove_from_article')))
                .on('click', () => {
                    this.removeTag(item)
                })

            tagItem.append(deleteButton)
            tagItem.append($$(FontAwesomeIcon, {icon: 'fa-circle'}).addClass('tag-icon'))
        }
        return tagItem
    }

    // TODO Tooltip
    // toggleTooltip = function (ev) {
    //     $(ev.target).tooltip('toggle')
    //     ev.target.timeout = window.setTimeout(function () {
    //         this.hideTooltip(ev)
    //     }.bind(this), 3000)
    // }
    //
    // hideTooltip = function (ev) {
    //     if (ev.target.timeout) {
    //         window.clearTimeout(ev.target.timeout)
    //         ev.target.timeout = undefined
    //     }
    //     $(ev.target).tooltip('hide')
    // }


    updateTagItemName(tagItem, loadedTag) {
        if (loadedTag.concept && loadedTag.concept.definition) {
            const definition = _.isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition]
            for (let i = 0; i < definition.length; i++) {
                const item = definition[i]
                if (item["@role"] === "drol:short") {
                    if (item["keyValue"] && item["keyValue"].length > 0) {
                        tagItem.attr('title', item["keyValue"])
                        break
                    }
                }
            }
        }
    }


    showStory(title) {
        this.context.api.ui.showDialog(StoryEditComponent,
            {
                item: this.state.loadedItem,
                reload: this.closeFromDialog.bind(this)
            },
            {
                title: title,
                global: true
            })
    }

    /**
     * Called when edit and info dialog is closed
     */
    closeFromDialog() {
        this.loadTag() // Reload new changes
        this.props.reload()
    }

    /**
     * Remove tag after fading item away
     * @param tag
     */
    removeTag(tag) {
        this.props.removeItem(tag)
    }

}

export default StoryItemComponent