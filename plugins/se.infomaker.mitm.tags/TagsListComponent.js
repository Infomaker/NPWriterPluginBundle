'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var TagItem = require('./TagItemComponent');

function TagsListComponent() {
    TagsListComponent.super.apply(this, arguments);

    this.name = 'tags';
}

TagsListComponent.Prototype = function () {

    this.didMount = function () {
    };


    this.render = function () {

        var tags = this.props.tags;

        var tagList = $$('ul').addClass('tag-list');

        var tagEls = tags.map(function (tag, idx) { // jshint ignore:line
            return $$(TagItem, {
                tag: tag,
                openTag: this.openTag.bind(this),
                removeTag: this.removeTag.bind(this),
                reload: this.props.reload.bind(this)
            }).ref('tag-'+tag.uuid);
        }, this);

        tagList.append(tagEls);

        return tagList;

    };

    this.removeTag = function(tag) {
        delete this.refs['tag-'+tag.uuid];
        this.props.removeTag(tag);
    };

    this.openTag = function(tag) {
        console.log("Open", tag);
    };

};

Component.extend(TagsListComponent);
module.exports = TagsListComponent;
