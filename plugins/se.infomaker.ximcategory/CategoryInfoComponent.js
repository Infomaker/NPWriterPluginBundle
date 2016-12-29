'use strict';
import {Component} from 'substance'
import {api, jxon} from 'writer'
// var ConceptUtil = require('vendor/infomaker.se/utils/ConceptUtil');

class ContentProfileInfoComponent extends Component{

    constructor(...args) {
        super(...args)
        // this.conceptUtil = new ConceptUtil()
    }

    // createContentProfile() {
    //     var conceptProfile = this.props.item,
    //         url = '/api/newsitem';
    //
    //     this.saveContentProfile(url, 'POST').done(function (data) {
    //         this.context.api.addConceptProfile(
    //             this.name, {
    //                 uuid: data,
    //                 title: conceptProfile.concept.name
    //             }
    //         );
    //
    //         this.props.reload();
    //         this.send('close');
    //     }.bind(this));
    // }
    //
    // updateContentProfile() {
    //     var conceptProfile = this.props.item;
    //     var uuid = conceptProfile['@guid'] ? conceptProfile['@guid'] : null;
    //     if (!uuid) {
    //         throw new Error("ConceptItem has no UUID to update");
    //     }
    //     var url = '/api/newsitem/' + uuid;
    //
    //     this.saveContentProfile(url, 'PUT').done(function () {
    //         this.context.api.updateConceptProfile(this.name, {
    //             uuid: uuid,
    //             title: conceptProfile.concept.name
    //         });
    //
    //         this.props.reload();
    //         this.send('close');
    //     }.bind(this));
    // }

    /**
     * Sets the definition description
     *
     * @param {string} inputValue The form value filled in by user
     * @param {string} role The definition type, drol:short or drol:long
     */
    // setDescription(inputValue, role) {
    //     var currentDescription = api.concept.getDefinitionForType(this.props.item.concept.definition, role);
    //     if (inputValue.length > 0 && !currentDescription) {
    //         const longDesc = {'@role': role, keyValue: inputValue};
    //         this.props.item.concept.definition = this.conceptUtil.setDefinitionDependingOnArrayOrObject(
    //             this.props.item.concept.definition,
    //             longDesc
    //         );
    //     }
    //     else if(inputValue.length >= 0 && currentDescription) {
    //         currentDescription['keyValue'] = inputValue;
    //     }
    // }

    /**
     * Method that saves conceptItem to backend
     * @param {string} url
     * @param {string} method POST, PUT
     * @returns {*} Returns jQuery ajax promise
     */
    saveContentProfile(url, method) {
        var contentProfile = this.props.item;

        var shortDescriptionInputValue = this.refs.storyShortDescInput.val();
        var longDescriptionInputValue = this.refs.storyLongDescText.val();

        // Check if definition exists
        if (!contentProfile.concept.definition) {
            contentProfile.concept.definition = [];
        }

        this.setDescription(shortDescriptionInputValue, 'drol:short');
        this.setDescription(longDescriptionInputValue, 'drol:long');

        this.xmlDoc = jxon.unbuild(contentProfile, null, 'conceptItem');
        var conceptItem = this.xmlDoc.documentElement.outerHTML;

        switch (method) {
            case "PUT":
                return this.context.api.router.put(url, conceptItem);

            case "POST":
                return this.context.api.router.post(url, conceptItem);
        }

    }

    render($$) {
        var el = $$('div').addClass('tag-edit-base');

        var formContainer = $$('form').addClass('concept-story__container clearfix').ref('formContainer').on('submit', (e) => {
            e.preventDefault();
            this.onClose('save');
        })

        // Add hidden submit button to enable enter submit
        formContainer.append(
            $$('input')
                .attr({
                    type: 'submit',
                    style: 'display:none'
                })
        )

        formContainer.append(this.renderNameInput($$));
        formContainer.append(this.renderShortDescription($$));
        formContainer.append(this.renderLongDescription($$));

        return el.append(formContainer);
    }


    // renderConceptObject() {
    //
    //     var paragraph = $$('p');
    //     if(this.props.item.concept.metadata && this.props.item.concept.metadata.object) {
    //         var object = this.props.item.concept.metadata.object;
    //         paragraph.append([
    //             $$('span').addClass('title').append(object['@title']),
    //             $$('span').addClass('type').append("(" + object['@type'] + ")")
    //         ]);
    //     }
    //     return paragraph;
    // }

    /**
     * Render a short description form fieldset
     * @returns {Component}
     */
    renderNameInput($$) {
        var nameInput = $$('input')
            .attr({
                type: 'text',
                id: 'storyNameInput'
            })
            .addClass('form-control').val(this.props.item.concept.name)
            .ref('nameInput')
            .on('change', () => {
                if (this.refs['nameInput'].val() === "") {
                    this.send("dialog:disablePrimaryBtn");
                }
                else {
                    this.send("dialog:enablePrimaryBtn");
                }
            })

        var formGroup = $$('fieldset')
            .addClass('form-group col-xs-6')
            .ref('formGroupName')

        formGroup.append(
            $$('label').attr('for', 'nameInput')
                .append(this.getLabel('Name')
            )
        )

        return formGroup.append(nameInput)
    }


    /**
     * Render a short description form fieldset
     * @returns {Component}
     */
    renderShortDescription($$) {
        var shortDescription = api.concept.getDefinitionForType(this.props.item.concept.definition, 'drol:short');
        var shortDescriptionValue = "";
        if (shortDescription) {
            shortDescriptionValue = shortDescription['keyValue'];
        }

        // Short Desc
        var shortDescInput = $$('input')
            .attr({
                id: 'storyShortDescInput'
            })
            .addClass('form-control')
            .val(shortDescriptionValue)
            .ref('storyShortDescInput');

        var formGroupShortDesc = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupShortDesc');
        formGroupShortDesc.append($$('label').attr('for', 'storyShortDescInput').append(this.getLabel('Short description')));
        formGroupShortDesc.append(shortDescInput);

        return formGroupShortDesc;
    }


    /**
     * Render form group for long description
     * @returns {*}
     */
    renderLongDescription($$) {

        var longDescription = api.concept.getDefinitionForType(this.props.item.concept.definition, 'drol:long'),
            longDescriptionValue = "";

        if (longDescription) {
            longDescriptionValue = longDescription.keyValue;
        }

        var longDescText = $$('textarea')
            .attr({
                id: 'storyLongDescText'
            })
            .addClass('form-control')
            .val(longDescriptionValue)
            .ref('storyLongDescText');

        var formGroupLongDesc = $$('fieldset').addClass('form-group col-xs-12').ref('formGroupLongDesc');
        formGroupLongDesc.append($$('label').attr('for', 'storyLongDescText').append(this.getLabel('Long description')));
        formGroupLongDesc.append(longDescText);
        return formGroupLongDesc;
    }

    onClose(/* status */) {
        return true; // Always return true for now. Remove line and enable seconary button to have edit capabilities
        // if ('cancel' === status) {
        //     return true;
        // }
        //
        // if (this.props.newContentProfile) {
        //     this.createContentProfile();
        // } else {
        //     this.updateContentProfile();
        // }
        //
        // return false;
    }
}

export default ContentProfileInfoComponent
