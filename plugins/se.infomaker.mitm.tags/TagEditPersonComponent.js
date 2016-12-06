'use strict';

var TagEditBaseComponent = require('./TagEditBaseComponent');
var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var jxon = require('jxon/index');
var replace = require('lodash/replace');
var find = require('lodash/find');

function TagEditComponent() {
    TagEditComponent.super.apply(this, arguments);
    this.name = 'tags';
}

TagEditComponent.Prototype = function () {


    this.save = function () {
        var tag = this.props.tag;

        var firstName = this.refs.firstNameInput.val(),
            lastName = this.refs.lastNameInput.val(),
            shortDesc = this.refs.shortDescInput.val(),
            longDesc = this.refs.longDescTextarea.val();

        var uuid = tag['@guid'] ? tag['@guid'] : null;

        // Set name
        var fullName = firstName + " " + lastName;
        tag.concept.name = fullName;

        // Make JSON to XML
        var xmlTag = jxon.unbuild(tag, null, 'conceptItem');
        this.xmlDoc = xmlTag;

        // Name
        var firstNameNode = this.xmlDoc.documentElement.querySelector('itemMetaExtProperty[type="imext:firstName"]');
        var lastNameNode = this.xmlDoc.documentElement.querySelector('itemMetaExtProperty[type="imext:lastName"]');
        firstNameNode.setAttribute('value', firstName);
        lastNameNode.setAttribute('value', lastName);

        // Description
        var shortDescNode = this.xmlDoc.documentElement.querySelector('concept definition[role="drol:short"]');
        var longDescNode = this.xmlDoc.documentElement.querySelector('concept definition[role="drol:long"]');
        shortDescNode.textContent = shortDesc;
        longDescNode.textContent = longDesc;


        // Social
        this.updateWebsite(this.refs.urlInput.val());
        this.updateTwitter(this.refs.twitterInput.val());
        this.updateFacebook(this.refs.facebookInput.val());

        if (uuid === null) {
            var ajax = this.createConcept(xmlTag.documentElement.outerHTML);
            ajax.done(function (uuid) {
                tag['@guid'] = uuid;
                tag.type = {};
                tag.type['@value'] = 'x-im/person';

                this.xmlDoc.querySelector('conceptItem').setAttribute('guid', uuid);
                this.context.api.addTag(this.name, {
                    uuid: uuid,
                    name: [fullName],
                    type: ['person'],
                    imType: ['x-im/person']
                });

                this.closeAndReload();
            }.bind(this));

        } else {
            var createAjax = this.saveConcept(uuid, xmlTag.documentElement.outerHTML);
            createAjax.done(function () {

                // If save is done, update the tag in article newsitem
                this.context.api.updateTag(this.name, uuid, {
                    name: [fullName],
                    imType: [tag.type['@value']]
                });
                this.closeAndReload();
            }.bind(this)).error(function (error, xhr, text) {
                console.log("", error, xhr, text);
            });
        }
    };

    this.render = function () {

        var el = $$('div').addClass('tag-edit tag-edit-person').addClass('row');

        var firstName = this.renderElement("firstNameInput", 'First name', this.getItemMetaExtProperty('imext:firstName')['@value'], false, 'input'),
            lastName = this.renderElement("lastNameInput", 'Last name', this.getItemMetaExtProperty('imext:lastName')['@value'], false, 'input'),
            shortDesc = this.renderElement('shortDescInput', this.context.i18n.t('Short description'), this.getConceptDefinition('drol:short').keyValue, true, 'input'),
            longDesc = this.renderElement('longDescTextarea', this.context.i18n.t('Long description'), this.getConceptDefinition('drol:long').keyValue, true, 'textarea');

        var websiteUrl = this.getSeeAlsoLinkByType('text/html'),
            websiteUrlEl = this.renderElement('urlInput', this.context.i18n.t('Website url'), websiteUrl ? websiteUrl['@url'] : '', true, 'input');

        var twitterUrl = this.getSeeAlsoLinkByType('x-im/social+twitter'),
            twitterEl = this.renderElement('twitterInput', this.context.i18n.t('Twitter url'), twitterUrl ? twitterUrl['@url'] : '', false, 'input');

        var facebook = this.getSeeAlsoLinkByType('x-im/social+facebook'),
            facebookEl = this.renderElement('facebookInput', this.context.i18n.t('Facebook url'), facebook ? facebook['@url'] : '', false, 'input');

        var tag = this.props.tag;

        firstName.on('change', function(){
            if (this.refs['firstNameInput'].val() === "") {
                this.send("dialog:disablePrimaryBtn");
            } else {
                this.send("dialog:enablePrimaryBtn");
            }
        }.bind(this));

        el.append([firstName, lastName, shortDesc, longDesc, websiteUrlEl, twitterEl, facebookEl]);
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
TagEditBaseComponent.extend(TagEditComponent);
module.exports = TagEditComponent;