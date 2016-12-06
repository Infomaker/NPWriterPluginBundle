'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var StoryItem = require('./StoryItemComponent');

function StoryListComponent() {
    StoryListComponent.super.apply(this, arguments);

    this.name = 'conceptstory';
}

StoryListComponent.Prototype = function () {

    this.render = function () {
        var items = this.props.items;
        var tagList = $$('ul').addClass('tag-list');
        var tagEls = items.map(function (item) {
            return $$(StoryItem, {
                item: item,
                removeItem: this.removeItem.bind(this),
                reload: this.props.reload.bind(this)
            }).ref('tag-'+item.uuid);
        }, this);
        //
        tagList.append(tagEls);

        return tagList;
    };

    this.removeItem = function(tag) {
        delete this.refs['tag-'+tag.uuid];
        this.props.removeItem(tag);
    };

};

Component.extend(StoryListComponent);
module.exports = StoryListComponent;
