'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var jxon = require('jxon/index');
var ConceptUtil = require('vendor/infomaker.se/utils/ConceptUtil');

function StoryEditComponent() {
    StoryEditComponent.super.apply(this, arguments);

    this.conceptUtil = new ConceptUtil();
}

StoryEditComponent.Prototype = function () {


    this.createLocation = function () {
        var story = this.props.item,
            url = '/api/newsitem';
        this.saveLocation(url, 'POST').done(function (data) {
            //Update tag in newsItem
            this.context.api.addStory(this.name, {
                title: story.concept.name,
                uuid: data
            });

            this.props.reload();
            this.send('close');
        }.bind(this));
    };

    this.updateLocation = function () {

        var story = this.props.item;
        var uuid = story['@guid'] ? story['@guid'] : null;
        if (!uuid) {
            throw new Error("ConceptItem has no UUID to update");
        }
        var url = '/api/newsitem/' + uuid;

        this.saveLocation(url, 'PUT').done(function () {
            //Update tag in newsItem
            this.context.api.updateStory(this.name, {
                title: story.concept.name,
                uuid: uuid
            });
            this.props.reload();
            this.send('close');
        }.bind(this));
    };

    /**
     * Sets the definition description
     *
     * @param {string} inputValue The form value filled in by user
     * @param {string} role The definition type, drol:short or drol:long
     */
    this.setDescription = function(inputValue, role) {
        var currentDescription = this.conceptUtil.getDefinitionForType(this.props.item.concept.definition, role);
        if(inputValue.length > 0 && !currentDescription) {
            var longDesc = {'@role': role, keyValue: inputValue};
            this.props.item.concept.definition = this.conceptUtil.setDefinitionDependingOnArrayOrObject(this.props.item.concept.definition, longDesc);
        } else if( inputValue.length >= 0 && currentDescription) {
            currentDescription['keyValue'] = inputValue;
        }
    };

    /**
     * Method that saves conceptItem to backend
     * @param {string} url
     * @param {string} method POST, PUT
     * @returns {*} Returns jQuery ajax promise
     */
    this.saveLocation = function (url, method) {
        var location = this.props.item;
        location.concept.name = this.refs.storyNameInput.val().length > 0 ? this.refs.storyNameInput.val() : location.concept.name;

        var shortDescriptionInputValue = this.refs.storyShortDescInput.val();
        var longDescriptionInputValue = this.refs.storyLongDescText.val();

        // Check if definition exists
        if(!location.concept.definition) {
            location.concept.definition = [];
        }

        this.setDescription(shortDescriptionInputValue, 'drol:short');
        this.setDescription(longDescriptionInputValue, 'drol:long');

        this.xmlDoc = jxon.unbuild(location, null, 'conceptItem');
        var conceptItem = this.xmlDoc.documentElement.outerHTML;

        switch (method) {
            case "PUT":
                return this.context.api.router.put(url, conceptItem);
                break;
            case "POST":
                return this.context.api.router.post(url, conceptItem);
                break;
        }

    };


    this.render = function () {

        var el = $$('div').addClass('tag-edit-base');

        var formContainer = $$('form').addClass('concept-story__container clearfix').ref('formContainer').on('submit', function (e) {
            e.preventDefault();
            if (this.refs['storyNameInput'].val() !== "") {
                this.onClose('save');
            }
        }.bind(this));

        var hiddenSubmitButtonToEnableEnterSubmit = $$('input').attr({type: 'submit', style: 'display:none'});
        formContainer.append(hiddenSubmitButtonToEnableEnterSubmit);

        formContainer.append(this.renderNameInput());
        formContainer.append(this.renderShortDescription());
        formContainer.append(this.renderLongDescription());


        el.append(formContainer);

        if (this.props.exists) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-info').append(this.context.i18n.t("Please note that this name is already in use") + ": " + this.props.item.concept.name)))
        }

        return el;
    };


    this.renderNameInput = function() {
        // Name
        var nameInput = $$('input').attr({
                type: 'text',
                id: 'storyNameInput'
            })
            .addClass('form-control').val(this.props.item.concept.name)
            .ref('storyNameInput');

        nameInput.on('change', function(){
            if (this.refs['storyNameInput'].val() === "") {
                this.send("dialog:disablePrimaryBtn");
            } else {
                this.send("dialog:enablePrimaryBtn");
            }
        }.bind(this));

        var formGroup = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupName');
        formGroup.append($$('label').attr('for', 'storyNameInput').append(this.context.i18n.t('Name')));
        formGroup.append(nameInput);
        return formGroup;
    };


    /**
     * Render a short description form fieldset
     * @returns {Component}
     */
    this.renderShortDescription = function() {
        var shortDescription = this.conceptUtil.getDefinitionForType(this.props.item.concept.definition, 'drol:short');
        var shortDescriptionValue = "";
        if(shortDescription) {
            shortDescriptionValue = shortDescription['keyValue'];
        }

        // Short Desc
        var shortDescInput = $$('input').attr({
                id: 'storyShortDescInput'
            })
            .addClass('form-control')
            .val(shortDescriptionValue)
            .ref('storyShortDescInput');

        var formGroupShortDesc = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupShortDesc');
        formGroupShortDesc.append($$('label').attr('for', 'storyShortDescInput').append(this.context.i18n.t('Short description')));
        formGroupShortDesc.append(shortDescInput);

        return formGroupShortDesc;
    };


    /**
     * Render form group for long description
     * @returns {*}
     */
    this.renderLongDescription = function() {

        var longDescription = this.conceptUtil.getDefinitionForType(this.props.item.concept.definition, 'drol:long'),
            longDescriptionValue = "";
        if(longDescription) {
            longDescriptionValue = longDescription.keyValue;
        }
        var longDescText = $$('textarea').attr({
                id: 'storyLongDescText'
            })
            .addClass('form-control')
            .val(longDescriptionValue)
            .ref('storyLongDescText');

        var formGroupLongDesc = $$('fieldset').addClass('form-group col-xs-12').ref('formGroupLongDesc');
        formGroupLongDesc.append($$('label').attr('for', 'storyLongDescText').append(this.context.i18n.t('Long description')));
        formGroupLongDesc.append(longDescText);
        return formGroupLongDesc;
    };

    this.onClose = function (status) {
        if ('cancel' === status) {
            return true;
        }

        if (this.props.newLocation) {
            this.createLocation();
        } else {
            this.updateLocation();
        }

        return false;

    };

};
Component.extend(StoryEditComponent);
module.exports = StoryEditComponent;