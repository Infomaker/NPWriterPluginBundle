'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var jxon = require('jxon/index');
var replace = require('lodash/replace');
var find = require('lodash/find');

function TagEditBaseComponent() {
    TagEditBaseComponent.super.apply(this, arguments);
    this.name = 'tags';
}

TagEditBaseComponent.Prototype = function () {


    this.saveConcept = function (uuid, newsItem) {
        return this.context.api.router.put('/api/newsitem/' + uuid, newsItem);

    };

    this.createConcept = function (newsItem) {
        return this.context.api.router.post('/api/newsitem/', newsItem);
    };


    /**
     * Creates, updates or delete an facebook link
     * @param facebookInputValue
     */
    this.updateFacebook = function (facebookInputValue) {
        var facebookNode = this.xmlDoc.documentElement.querySelector('itemMeta links link[rel="irel:seeAlso"][type="x-im/social+facebook"]');
        if (facebookInputValue.length > 0 && !facebookNode) {
            this.createLinkNode(this.xmlDoc, {
                type: 'x-im/social+facebook',
                rel: 'irel:seeAlso',
                url: facebookInputValue
            });
        } else if (facebookNode && facebookInputValue.length > 0) {
            facebookNode.setAttribute('url', facebookInputValue);
        } else if (facebookInputValue.length === 0 && facebookNode) {
            facebookNode.parentElement.removeChild(facebookNode);
        }
    };


    /**
     * Creates, updates or delete a twitter link
     * @param twitterInputValue
     */
    this.updateTwitter = function (twitterInputValue) {
        var twitterNode = this.xmlDoc.documentElement.querySelector('itemMeta links link[rel="irel:seeAlso"][type="x-im/social+twitter"]');
        if (twitterInputValue.length > 0 && !twitterNode) {
            this.createLinkNode(this.xmlDoc, {
                type: 'x-im/social+twitter',
                rel: 'irel:seeAlso',
                url: twitterInputValue
            });
        } else if (twitterNode && twitterInputValue.length > 0) {
            twitterNode.setAttribute('url', twitterInputValue);
        } else if (twitterInputValue.length === 0 && twitterNode) {
            twitterNode.parentElement.removeChild(twitterNode);
        }
    };

    /**
     * Creates, updates or delete a website link
     * @param websiteInputValue
     */
    this.updateWebsite = function (websiteInputValue) {
        var websiteNode = this.xmlDoc.documentElement.querySelector('itemMeta links link[rel="irel:seeAlso"][type="text/html"]');
        if (websiteInputValue.length > 0 && !websiteNode) {
            this.createLinkNode(this.xmlDoc, {type: 'text/html', rel: 'irel:seeAlso', url: websiteInputValue});
        } else if (websiteNode && websiteInputValue.length > 0) {
            websiteNode.setAttribute('url', websiteInputValue);
        } else if (websiteInputValue.length === 0 && websiteNode) {
            websiteNode.parentElement.removeChild(websiteNode);
        }
    };


    this.createLinkNode = function (xmlDoc, attributes) {
        var linkNode = xmlDoc.createElement('link');
        for (var key in attributes) {
            linkNode.setAttribute(key, attributes[key]);
        }
        xmlDoc.documentElement.querySelector('itemMeta links').appendChild(linkNode);

        return linkNode;
    };


    /**
     * Search after specific type in itemMeta for concept
     * @param key
     * @returns {*}
     */
    this.getItemMetaExtProperty = function (key) {
        var result = find(this.props.tag.itemMeta.itemMetaExtProperty, function (item) {
            return item['@type'] === key;
        });
        return result;
    };

    this.getConceptDefinition = function (key) {
        var result = find(this.props.tag.concept.definition, function (item) {
            return item['@role'] === key;
        });
        return result;
    };

    this.getSeeAlsoLinkByType = function (type) {
        return find(this.props.tag.itemMeta.links.link, function (link) {
            return link['@type'] === type && link['@rel'] === 'irel:seeAlso';
        });
    };

    this.render = function () {

        var el = $$('div').addClass('tag-edit tag-edit-base');

        var personBtn = $$('button').append($$(Icon, {icon: 'fa-user'})).append($$('span').append(this.context.i18n.t('Person'))).on('click', this.createPerson);
        var organisationBtn = $$('button').append($$(Icon, {icon: 'fa-sitemap'})).append($$('span').append(this.context.i18n.t('Organisation'))).on('click', this.createOrganisation);
        var topicBtn = $$('button').append($$(Icon, {icon: 'fa-tags'})).append($$('span').append(this.context.i18n.t('Topic'))).on('click', this.createTopic);
        el.append($$('small').addClass('text-muted').append(this.context.i18n.t('What kind of concept do you want to create?')));
        el.append([personBtn, organisationBtn, topicBtn]);

        if (this.props.exists) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-info').append(this.context.i18n.t("Please note that this name is already in use") + ": " + this.props.tag.value)))
        }

        return el;
    };

    this.createPerson = function () {
        this.send('close');
        this.props.createPerson(this.props.tag.inputValue);
    };

    this.createOrganisation = function () {
        this.send('close');
        this.props.createOrganisation(this.props.tag.inputValue);
    };

    this.createTopic = function () {
        this.send('close');
        this.props.createTopic(this.props.tag.inputValue);
    };

    this.closeAndReload = function () {
        this.props.close(); // Let the TagItemComponent know that save is done
        this.send('close'); // Close the modal
    };


    this.renderElement = function (refName, label, inputValue, fullWidth, inputType) {
        var cssClass = fullWidth ? 'col-xs-12' : 'col-xs-12 col-sm-6';
        var input;
        switch (inputType) {
            case 'textarea':
                input = this.getTextAreaElement();
                break;
            default:
                input = this.getTextInputElement();
                break;
        }
        var formGroup = $$('fieldset').addClass('form-group').addClass(cssClass);
        formGroup.append($$('label').append(label));
        formGroup.append(input.val(inputValue).ref(refName));
        return formGroup;
    };

    /**
     * Generate an input of type text
     * @returns {*|this}
     */
    this.getTextInputElement = function () {
        return $$('input').attr('type', 'text').addClass('form-control');
    };


    /**
     * Generate a textarea form
     * @returns {component}
     */
    this.getTextAreaElement = function () {
        return $$('textarea').attr('rows', '4').addClass('form-control');
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
Component.extend(TagEditBaseComponent);
module.exports = TagEditBaseComponent;