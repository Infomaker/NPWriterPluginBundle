'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var jxon = require('jxon/index');
var Config = require('./config/Config');
var find = require('lodash/find');
var _ = require('lodash');
var Avatar = require('writer/components/avatar/AvatarComponent');


function TagsItemComponent() {
    TagsItemComponent.super.apply(this, arguments);

    this.name = 'tags';

    this.handleActions({
        'avatarLoaded': this.avatarLoaded
    });
}

TagsItemComponent.Prototype = function () {

    this.avatarLoaded = function (avatar) {
        if (avatar.useDummyAvatar) {
            this.addClass('tag-item--dummy-avatar');
        } else {
            this.removeClass('tag-item--dummy-avatar');
        }
    };

    //this.getInitialState = function() {
    //return {
    //    useDummyAvatar: false
    //};
    //};

    /**
     * Get itemMetaExtension property in itemMeta section.
     * @param type
     * @returns {*}
     */
    this.getItemMetaExtPropertyByType = function (type) {
        if (_.isArray(this.loadedTag.itemMeta.itemMetaExtProperty)) {
            return find(this.loadedTag.itemMeta.itemMetaExtProperty, function (itemMeta) {
                return itemMeta['@type'] === type;
            });
        } else if (_.isObject(this.loadedTag.itemMeta.itemMetaExtProperty)) {
            if (this.loadedTag.itemMeta.itemMetaExtProperty['@type'] === type) {
                return this.loadedTag.itemMeta.itemMetaExtProperty;
            }
        }
    };

    this.loadTag = function () {
        this.ajaxRequest = this.context.api.router.ajax('GET', 'xml',
            '/api/newsitem/' + this.props.tag.uuid, {imType: this.props.tag.type});
        this.ajaxRequest
            .done(function (data) {
                var conceptXML = data.querySelector('conceptItem');
                this.loadedTag = jxon.build(conceptXML);

                //Add tagType to loaded tag
                this.loadedTag.type = this.getItemMetaExtPropertyByType('imext:type');
                this.isLoaded = true;
                this.rerender();
            }.bind(this))
            .error(function () {
                this.isLoaded = true;
                this.couldNotLoad = true;
                this.rerender();
            }.bind(this));
    };

    this.render = function () {
        var tag = this.props.tag;

        var tagItem = $$('li').addClass('tag-list__item').ref('tagItem');
        var displayNameEl = $$('span'),
            displayName;

        displayNameEl.attr('title', this.getNameForTag(tag));

        if (!this.isLoaded) {
            this.loadTag();
        } else {
            if (this.couldNotLoad) {
                displayNameEl.addClass(
                    'tag-item__title tag-item__title--no-avatar tag-item__title--notexisting')
                    .append(tag.title)
                    .attr('title',
                        this.context.i18n.t('This item could not be loaded. UUID: ') + tag.uuid);
                displayName = tag.title;
            } else {
                displayNameEl.addClass('tag-item__title').append(this.loadedTag.concept.name);
                displayName = this.loadedTag.concept.name;
                this.updateTagItemName(displayNameEl, this.loadedTag);

                displayNameEl.attr('data-toggle', 'tooltip')
                    .attr('data-placement', 'bottom')
                    .attr('data-trigger', 'manual');

                displayNameEl.on('click', function (ev) {
                    $(ev.target).tooltip('hide');
                    if (Config.isTagEditable(tag)) {
                        this.editTag(displayName);
                    } else {
                        this.showTag(displayName);
                    }
                }.bind(this));
                displayNameEl.on('mouseenter', this.toggleTooltip);
                displayNameEl.on('mouseout', this.hideTooltip);


                tagItem.append(
                    $$(Avatar, {author: this.loadedTag, links: this.loadedTag.itemMeta.links}));
            }

            tagItem.append(displayNameEl);

            var deleteButton = $$('span').append($$(Icon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.context.i18n.t('Remove from article')))
                .on('click', function () {
                    this.removeTag(tag);
                }.bind(this));

            tagItem.append(deleteButton);
            var iconComponent = this.getIconForTag(tag);
            if (iconComponent) {
                tagItem.append(iconComponent);
            }
        }
        return tagItem;
    };

    this.showTag = function (title) {
        var tagInfo = require('./TagInfoComponent');
        this.context.api.showDialog(tagInfo, {
            tag: this.loadedTag,
            close: this.closeFromDialog.bind(this),
            couldNotLoad: this.couldNotLoad
        }, {
            secondary: false,
            title: title,
            global: true
        });
    };

    /**
     * Shows a edit component in dialoag
     * @param title
     */
    this.editTag = function (title) {
        var tagEdit;

        switch (this.loadedTag.type['@value']) {
            case 'x-im/organisation':
                tagEdit = require('./TagEditCompanyComponent');
                break;
            case 'x-im/person':
                tagEdit = require('./TagEditPersonComponent');
                break;
            case 'x-im/topic':
                tagEdit = require('./TagEditTopicComponent');
                break;
            default:
                break;
        }

        this.context.api.showDialog(tagEdit, {
            tag: this.loadedTag,
            close: this.closeFromDialog.bind(this),
            couldNotLoad: this.couldNotLoad
        }, {
            primary: this.context.i18n.t('Save'),
            title: this.context.i18n.t('Edit') + " " + title,
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
            this.props.removeTag(tag);
        }.bind(this));

    };

    this.getIconForTag = function (tag) {
        if (!tag.type) {
            return this.getDefaultIconForTag();
        }

        var tagConfig = Config.types[tag.type];
        if (tagConfig) {
            return $$(Icon, {icon: tagConfig.icon}).addClass('tag-icon');
        } else {
            this.getDefaultIconForTag();
        }

    };

    this.getNameForTag = function (tag) {
        if (!tag.type) {
            return;
        }
        var tagConfig = Config.types[tag.type];
        if (tagConfig) {
            return tagConfig.name;
        }

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

    this.getDefaultIconForTag = function () {
        return $$(Icon, {icon: 'fa-tag'}).addClass('tag-icon');
    };

    this.openTag = function (tag) {
        console.log("Open", tag);
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

};

Component.extend(TagsItemComponent);
module.exports = TagsItemComponent;
