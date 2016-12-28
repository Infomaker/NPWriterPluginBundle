import {Component, FontAwesomeIcon as Icon} from 'substance'
import {api, jxon, lodash as _} from 'writer'
import CategoryInfo from './CategoryInfoComponent';

// var Icon = require('substance/ui/FontAwesomeIcon');
// var jxon = require('jxon/index');

class CategoryItemComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'conceptcategory'
    }

    loadTag() {
        this.ajaxRequest = this.context.api.router.ajax(
            'GET',
            'xml',
            '/api/newsitem/' + this.props.item.uuid, {imType: this.props.item.type}
        )

        this.ajaxRequest
            .done(function(data) {
                var conceptXML = data.querySelector('conceptItem')
                var conceptItemJSON = jxon.build(conceptXML)

                this.setState({
                    loadedItem: conceptItemJSON,
                    isLoaded: true
                })
            }.bind(this))
            .error(function () {
                this.setState({
                    couldNotLoad: true,
                    isLoaded: true
                })
            }.bind(this))
    }

    render($$) {
        var item = this.props.item

        var tagItem = $$('li').addClass('tag-list__item').ref('tagItem')
        var displayNameEl = $$('span'),
            displayName

        displayNameEl.attr('title', 'Story')

        if (!this.state.isLoaded) {
            this.loadTag();
        }
        else {
            if (this.state.couldNotLoad) {
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar tag-item__title--notexisting').append(item.title)
                displayName = item.title
            }
            else {
                displayName = item.title
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar')
                    .append(displayName)

                displayNameEl.attr('title', displayName)

                this.updateTagItemName(displayNameEl, this.state.loadedItem)

                displayNameEl
                    .attr('data-toggle', 'tooltip')
                    .attr('data-placement', 'bottom')
                    .attr('data-trigger', 'manual')


                displayNameEl.on('click', function() {
                    this.showInfo(displayName)
                }.bind(this))

                displayNameEl.on('mouseenter', this.toggleTooltip)
                displayNameEl.on('mouseout', this.hideTooltip)
            }

            tagItem.append(displayNameEl)

            var deleteButton = $$('span').append($$(Icon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.context.i18n.t('Remove from article')))
                .on('click', function () {
                    this.removeTag(item)
                }.bind(this))

            tagItem.append(deleteButton)
            tagItem.append($$(Icon, {icon: 'fa-folder'}).addClass('tag-icon'))
        }

        return tagItem;
    }

    toggleTooltip(ev) {
        // $(ev.target).tooltip('toggle')
        // ev.target.timeout = window.setTimeout(function () {
        //     this.hideTooltip(ev)
        // }.bind(this), 3000)
    }

    hideTooltip(ev) {
        // if (ev.target.timeout) {
        //     window.clearTimeout(ev.target.timeout)
        //     ev.target.timeout = undefined
        // }
        //
        // $(ev.target).tooltip('hide')
    }

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
        api.showDialog(
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
        this.loadTag() // Reload new changes
        this.props.reload()
    }

    /**
     * Remove tag after fading item away
     * @param tag
     */
    removeTag(tag) {
        this.$el.first().fadeOut(300, function () {
            this.props.removeItem(tag)
        }.bind(this))
    }
}

export default CategoryItemComponent
