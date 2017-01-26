import {Component, FontAwesomeIcon as Icon} from 'substance'
import {api, jxon, lodash as _} from 'writer'
import CategoryInfo from './CategoryInfoComponent';

class CategoryItemComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'conceptcategory'
    }

    loadTag(item) {
        api.router.getConceptItem(
            item.uuid,
            item.type
        )
        .then(xml => {
            const conceptXML = xml.querySelector('conceptItem'),
                conceptItemJSON = jxon.build(conceptXML)

            this.extendState({
                loadedItem: conceptItemJSON,
                isLoaded: true
            })
        })
        .catch(() => {
            this.extendState({
                isLoaded: true,
                couldNotLoad: true
            })
        })
    }

    render($$) {
        const tagItem = $$('li')
                .addClass('tag-list__item')
                .ref('tagItem'),
            displayNameEl = $$('span')
                .addClass('tag-item__title tag-item__title--no-avatar')
                .attr('title', this.getLabel('Category'))

        if (!this.state.isLoaded) {
            this.loadTag(this.props.item)

            return tagItem.append(
                displayNameEl
                    .addClass('tag-item__title--notexisting')
                    .append(this.props.item.title)
            )
        }

        if (this.state.couldNotLoad) {
            displayNameEl
                .addClass('tag-item__title--notexisting')
                .append(this.props.item.title)
        }
        else {
            let displayName = this.props.item.title

            displayNameEl
                .append(displayName)
                .attr('title', displayName)

            this.updateTagItemName(displayNameEl, this.state.loadedItem)

            displayNameEl
                .attr('data-toggle', 'tooltip')
                .attr('data-placement', 'bottom')
                .attr('data-trigger', 'manual')
                .on('click', () => {
                    this.showInfo(displayName)
                })
                // .on('mouseenter', this.toggleTooltip)
                // .on('mouseout', this.hideTooltip)
        }

        tagItem.append([
            displayNameEl,
            $$('span').append($$(Icon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.getLabel('Remove from article')))
                .on('click', () => {
                    this.removeTag(this.props.item)
                }),
            $$(Icon, {icon: 'fa-folder'})
                .addClass('tag-icon')
        ])

        return tagItem;
    }

    /**
     * @todo Implement
     */
    // toggleTooltip(ev) {
    //     $(ev.target).tooltip('toggle')
    //     ev.target.timeout = window.setTimeout(function () {
    //         this.hideTooltip(ev)
    //     }.bind(this), 3000)
    // }

    /**
     * @todo Implement
     */
    // hideTooltip(ev) {
    //     if (ev.target.timeout) {
    //         window.clearTimeout(ev.target.timeout)
    //         ev.target.timeout = undefined
    //     }
    //
    //     $(ev.target).tooltip('hide')
    // }

    updateTagItemName(tagItem, loadedTag) {
        if (!loadedTag.concept || loadedTag.concept.definition) {
            return
        }

        var definition = _.isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition]
        for (var i = 0; i < definition.length; i++) {
            var item = definition[i]

            if (item["@role"] === "drol:short") {
                if (item["keyValue"] && item["keyValue"].length > 0) {
                    tagItem.attr('title', item["keyValue"])
                    break
                }
            }
        }
    }

    showInfo(title) {
        api.ui.showDialog(
            CategoryInfo, {
                item: this.state.loadedItem,
                reload: this.closeFromDialog.bind(this)
            },
            {
                title: title,
                global: true,
                secondary: false
            }
        )
    }

    /**
     * Called when edit and info dialog is closed
     */
    closeFromDialog() {
        this.loadTag(this.props.item) // Reload new changes
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

export default CategoryItemComponent
