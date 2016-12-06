'use strict';

var TagEditBase = require('./TagEditBaseComponent');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var jxon = require('jxon/index');
var replace = require('lodash/replace');
var find = require('lodash/find');

function TagInfoComponent() {
    TagInfoComponent.super.apply(this, arguments);
}

TagInfoComponent.Prototype = function () {

    this.render = function () {
        var el = $$('div').addClass('tag-edit-base');

        var shortDescription = this.getConceptDefinition('drol:short');
        if(shortDescription) {
            var shortDescEl = $$('p').append(shortDescription.keyValue);
            el.append(shortDescEl);
        }


        var longDescription = this.getConceptDefinition('drol:long');
        if(longDescription) {
            var longDescEl = $$('p').append(longDescription.keyValue);
            el.append(longDescEl);
        }

        return el;
    };

    this.onClose = function () { };

};
TagEditBase.extend(TagInfoComponent);
module.exports = TagInfoComponent;