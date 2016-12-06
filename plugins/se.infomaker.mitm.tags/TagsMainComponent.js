'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var SearchComponent = require('writer/components/form-search/FormSearchComponent');
var TagsList = require('./TagsListComponent');
var jxon = require('jxon/index');
var Icon = require('substance/ui/FontAwesomeIcon');

function TagsMainComponent() {
    TagsMainComponent.super.apply(this, arguments);
    this.name = 'tags';

}

TagsMainComponent.Prototype = function () {

    this.getTagTypes = function() {
        return [
            'x-im/organisation',
            'x-im/person',
            'x-im/topic'
        ];
    };

    this.getInitialState = function () {
        return {
            existingTags: this.context.api.getLinksByType(this.name, this.getTagTypes(), "subject")
        };
    };


    this.reload = function () {
        this.extendState({
            existingTags: this.context.api.getLinksByType(this.name, this.getTagTypes(), "subject")
        });
    };

    this.render = function () {

        this.context.api.getTags();

        var el = $$('div').ref('tagContainer').addClass('authors').append($$('h2').append('Organisationer/personer/ämnen'));

        var searchUrl = this.context.api.router.getEndpoint();

        var searchComponent = $$(SearchComponent, {
            existingItems: this.state.existingTags,
            searchUrl: searchUrl+'/api/search/concepts/tags?q=',
            onSelect: this.addTag.bind(this),
            onCreate: this.createTag.bind(this),
            placeholderText: "Sök Organisationer/personer/ämnen",
            createAllowed: true
        }).ref('searchComponent');

        var tagList = $$(TagsList, {
            tags: this.state.existingTags,
            removeTag: this.removeTag.bind(this),
            reload: this.reload.bind(this)
        }).ref('tagList');

        el.append(tagList);
        el.append(searchComponent);

        return el;

    };

    /**
     * @param tag
     */
    this.removeTag = function (tag) {
        try {
            this.context.api.removeLinkByUUIDAndRel(this.name, tag.uuid, 'subject');
            this.reload();
        } catch (e) {
            console.log(e);
        }
    };

    this.addTag = function (tag) {
        try {
            console.log("Add this tag", tag);
            this.context.api.addTag(this.name, tag);
            this.reload();
        } catch (e) {

        }
    };

    this.createTag = function (tag, exists) {
        try {
            var tagEdit = require('./TagEditBaseComponent');

            this.context.api.showDialog(tagEdit, {
                tag: tag,
                exists: exists,
                close: this.closeFromDialog.bind(this),
                createPerson: this.createPerson.bind(this),
                createOrganisation: this.createOrganisation.bind(this),
                createTopic: this.createTopic.bind(this)
            }, {
                primary: false,
                title: this.context.i18n.t('Create') + " " + tag.inputValue,
                global: true
            });

        } catch (e) {
            console.log("E", e);
        }
    };


    this.createPerson = function(inputValue) {
        var newName = inputValue.split(' ');
        var tagEdit = require('./TagEditPersonComponent');
        var tagXMLTemplate = require('./template/concept');
        var tagXML = $.parseXML(tagXMLTemplate.personTemplate).firstChild;

        // Prepopulate the TAG with user input from form
        tagXML.querySelector('itemMeta itemMetaExtProperty[type="imext:firstName"]').setAttribute('value', newName[0]);
        tagXML.querySelector('itemMeta itemMetaExtProperty[type="imext:lastName"]').setAttribute('value', newName[1] ? newName[1] : '');
        var loadedTag = jxon.build(tagXML);

        this.context.api.showDialog(tagEdit, {
            tag: loadedTag,
            close: this.closeFromDialog.bind(this)
        }, {
            primary: this.context.i18n.t('Save'),
            title: $$('span').append($$(Icon, {icon:'fa-user'})).append(" " + this.context.i18n.t('Create ') + " " + inputValue),
            global: true
        });


    };

    this.createOrganisation = function(inputValue) {
        var tagEdit = require('./TagEditCompanyComponent');
        var tagXMLTemplate = require('./template/concept');
        var tagXML = $.parseXML(tagXMLTemplate.organisationTemplate).firstChild;

        // Prepopulate the TAG with user input from form
        tagXML.querySelector('concept name').textContent = inputValue;
        var loadedTag = jxon.build(tagXML);

        this.context.api.showDialog(tagEdit, {
            tag: loadedTag,
            close: this.closeFromDialog.bind(this)
        }, {
            primary: this.context.i18n.t('Save'),
            title: $$('span').append($$(Icon, {icon:'fa-sitemap'})).append(" " + this.context.i18n.t('Create ') + " " + inputValue),
            global: true
        });

    };

    this.createTopic = function(inputValue) {
        var tagEdit = require('./TagEditTopicComponent');
        var tagXMLTemplate = require('./template/concept');
        var tagXML = $.parseXML(tagXMLTemplate.topicTemplate).firstChild;

        // Prepopulate the TAG with user input from form
        tagXML.querySelector('concept name').textContent = inputValue;
        var loadedTag = jxon.build(tagXML);

        this.context.api.showDialog(tagEdit, {
            tag: loadedTag,
            close: this.closeFromDialog.bind(this)
        }, {
            primary: this.context.i18n.t('Save'),
            title: $$('span').append($$(Icon, {icon:'fa-tags'})).append(" " + this.context.i18n.t('Create ') + " " + inputValue),
            global: true
        });

    };


    this.closeFromDialog = function() {
        this.reload();

    };
};

Component.extend(TagsMainComponent);
module.exports = TagsMainComponent;
