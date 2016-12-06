'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var jxon = require('jxon/index');
var find = require('lodash/find');
var _ = require('lodash');

function StoryItemComponent() {
    StoryItemComponent.super.apply(this, arguments);

    this.name = 'conceptstory';

}

StoryItemComponent.Prototype = function () {

    this.loadTag = function () {
        this.ajaxRequest = this.context.api.router.ajax('GET', 'xml', '/api/newsitem/' + this.props.item.uuid, {imType: this.props.item.type});
        this.ajaxRequest
            .done(function (data) {
                var conceptXML = data.querySelector('conceptItem');
                var conceptItemJSON = jxon.build(conceptXML);
                this.setState({
                    loadedItem: conceptItemJSON,
                    isLoaded: true
                });
            }.bind(this))
            .error(function () {
                this.setState({
                    couldNotLoad: true,
                    isLoaded: true
                });
            }.bind(this));
    };


    /**
     * Render method
     * @returns {Component}
     */
    this.render = function () {
        var item = this.props.item;

        var tagItem = $$('li').addClass('tag-list__item').ref('tagItem').attr('title', 'Story');
        var displayNameEl = $$('span'),
            displayName;

        if (!this.state.isLoaded) {
            this.loadTag();
        } else {
            if (this.state.couldNotLoad) {
                displayNameEl.addClass('tag-item__title  tag-item__title--no-avatar tag-item__title--notexisting')
                    .append(item.title)
                    .attr('title', this.context.i18n.t('This item could not be loaded. UUID: ')+item.uuid);
                displayName = item.title;
            } else {
                displayName = this.state.loadedItem.concept.name;
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar').append(displayName);
                displayNameEl.on('click', function () {
                    this.showStory(displayName);
                }.bind(this));
            }

            displayNameEl.attr('title', displayName);
            this.updateTagItemName(displayNameEl, this.state.loadedItem);

            displayNameEl.attr('data-toggle', 'tooltip')
                .attr('data-placement', 'bottom')
                .attr('data-trigger', 'manual');

            displayNameEl.on('mouseenter', this.toggleTooltip);
            displayNameEl.on('mouseout', this.hideTooltip);

            tagItem.append(displayNameEl);

            var deleteButton = $$('span').append($$(Icon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.context.i18n.t('Remove from article')))
                .on('click', function () {
                    this.removeTag(item);
                }.bind(this));

            tagItem.append(deleteButton);
            tagItem.append($$(Icon, {icon: 'fa-circle'}).addClass('tag-icon'));
        }
        return tagItem;
    };

    this.toggleTooltip = function (ev) {
        $(ev.target).tooltip('toggle');
        ev.target.timeout = window.setTimeout(function () {
            this.hideTooltip(ev)
        }.bind(this), 3000)
    };

    this.hideTooltip = function (ev) {
        if (ev.target.timeout) {
            window.clearTimeout(ev.target.timeout);
            ev.target.timeout = undefined;
        }
        $(ev.target).tooltip('hide');
    };


    this.updateTagItemName = function (tagItem, loadedTag) {
        if (loadedTag.concept && loadedTag.concept.definition) {
            var definition = _.isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition];
            for (var i = 0; i < definition.length; i++) {
                var item = definition[i];
                if (item["@role"] === "drol:short") {
                    if (item["keyValue"] && item["keyValue"].length > 0) {
                        tagItem.attr('title', item["keyValue"]);
                        break;
                    }
                }
            }
        }
    };


    this.showStory = function (title) {
        var storyEdit = require('./StoryEditComponent');
        this.context.api.showDialog(storyEdit, {
                item: this.state.loadedItem,
                reload: this.closeFromDialog.bind(this)
            },
            {
                title: title,
                global: true
            });
    };

    /**
     * Called when edit and info dialog is closed
     */
    this.closeFromDialog = function () {
        this.loadTag(); // Reload new changes
        this.props.reload();
    };

    /**
     * Remove tag after fading item away
     * @param tag
     */
    this.removeTag = function (tag) {
        this.$el.first().fadeOut(300, function () {
            this.props.removeItem(tag);
        }.bind(this));

    };

};

Component.extend(StoryItemComponent);
module.exports = StoryItemComponent;
