'use strict';

var TagEditComponent = require('./TagEditBaseComponent');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var jxon = require('jxon/index');
var replace = require('lodash/replace');
var find = require('lodash/find');

function TagEditTopicComponent() {
    TagEditTopicComponent.super.apply(this, arguments);
    this.name = 'tags';
}

TagEditTopicComponent.Prototype = function () {


    this.save = function () {
        var tag = this.props.tag;

        var name = this.refs.nameInput.val(),
            shortDesc = this.refs.shortDescInput.val(),
            longDesc = this.refs.longDescTextarea.val();

        var uuid = tag['@guid'] ? tag['@guid'] : null;

        // Set name
        tag.concept.name = name;

        // Make JSON to XML
        var xmlTag = jxon.unbuild(tag, null, 'conceptItem');
        this.xmlDoc = xmlTag;

        // Description
        var shortDescNode = xmlTag.documentElement.querySelector('concept definition[role="drol:short"]');
        var longDescNode = xmlTag.documentElement.querySelector('concept definition[role="drol:long"]');
        shortDescNode.textContent = shortDesc;
        longDescNode.textContent = longDesc;


        if (uuid === null) {
            var ajax = this.createConcept(xmlTag.documentElement.outerHTML);
            ajax.done(function (uuid) {

                this.xmlDoc.querySelector('conceptItem').setAttribute('guid', uuid);
                this.context.api.addTag(this.name, {
                    uuid: uuid,
                    name: [name],
                    type: ['organisation'],
                    imType: ['x-im/topic']
                });

                this.closeAndReload();
            }.bind(this));

        } else {
            var createAjax = this.saveConcept(uuid, xmlTag.documentElement.outerHTML);
            createAjax.done(function () {
                // If save is done, update the tag in article newsitem
                this.context.api.updateTag(this.name, uuid, {
                    name: [name],
                    subject: 'subject',
                    imType: [tag.type['@value']]
                });
                this.closeAndReload();

            }.bind(this)).error(function (error, xhr, text) {
                console.log("", error, xhr, text);
            });
        }
    };


    this.render = function () {
        var tag = this.props.tag;
        var el = $$('div').addClass('tag-edit tag-edit-person').addClass('row');

        var name = this.renderElement("nameInput", 'Name', tag.concept.name, true, 'input'),
            shortDesc = this.renderElement('shortDescInput', this.context.i18n.t('Short description'), this.getConceptDefinition('drol:short').keyValue, true, 'input'),
            longDesc = this.renderElement('longDescTextarea', this.context.i18n.t('Long description'), this.getConceptDefinition('drol:long').keyValue, true, 'textarea');


        name.on('change', function(){
            if (this.refs['nameInput'].val() === "") {
                this.send("dialog:disablePrimaryBtn");
            } else {
                this.send("dialog:enablePrimaryBtn");
            }
        }.bind(this));

        el.append([name, shortDesc, longDesc]);
        return el;
    };


    this.onClose = function (status) {

        if (status === "cancel") {
            return;
        } else if (status === "save") {
            this.save();
            return false;
        }

    };

};
TagEditComponent.extend(TagEditTopicComponent);
module.exports = TagEditTopicComponent;