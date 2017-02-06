import {Component} from 'substance'
import {jxon} from 'writer'

class StoryEditComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    createLocation() {
        const story = this.props.item

        this.saveLocation(null, 'POST')
            .then((data) => {
                //Update tag in newsItem
                this.context.api.newsItem.addStory(this.name, {
                    title: story.concept.name,
                    uuid: data
                })
                if (this.state.error) {
                    this.extendState({error: false})
                }
                this.props.reload()
                this.send('close')
            })
            .catch(() => {
                this.extendState({error: true})
            })
    }

    updateLocation() {

        const story = this.props.item,
            uuid = story['@guid'] ? story['@guid'] : null

        if (!uuid) {
            throw new Error("ConceptItem has no UUID to update")
        }

        this.saveLocation(uuid, 'PUT')
            .then(() => {
                //Update tag in newsItem
                this.context.api.newsItem.updateStory(this.name, {
                    title: story.concept.name,
                    uuid: uuid
                })
                if (this.state.error) {
                    this.extendState({error: false})
                }
                this.props.reload()
                this.send('close')
            })
            .catch(() => {
                this.extendState({error: true});
            })
    }

    /**
     * Sets the definition description
     *
     * @param {string} inputValue The form value filled in by user
     * @param {string} role The definition type, drol:short or drol:long
     */
    setDescription(inputValue, role) {
        const currentDescription = this.context.api.concept.getDefinitionForType(this.props.item.concept.definition, role)
        if (inputValue.length > 0 && !currentDescription) {
            const longDesc = {'@role': role, keyValue: inputValue}
            this.props.item.concept.definition = this.context.api.concept.setDefinitionDependingOnArrayOrObject(this.props.item.concept.definition, longDesc)
        } else if (inputValue.length >= 0 && currentDescription) {
            currentDescription['keyValue'] = inputValue
        }
    }

    /**
     * Method that saves conceptItem to backend
     * @param {string} url
     * @param {string} method POST, PUT
     * @returns {*} Returns jQuery ajax promise
     */
    saveLocation(id, method) {
        const location = this.props.item
        location.concept.name = this.refs.storyNameInput.val().length > 0 ? this.refs.storyNameInput.val() : location.concept.name

        const shortDescriptionInputValue = this.refs.storyShortDescInput.val()
        const longDescriptionInputValue = this.refs.storyLongDescText.val()

        // Check if definition exists
        if (!location.concept.definition) {
            location.concept.definition = []
        }

        this.setDescription(shortDescriptionInputValue, 'drol:short')
        this.setDescription(longDescriptionInputValue, 'drol:long')

        this.xmlDoc = jxon.unbuild(location, null, 'conceptItem')
        const conceptItem = this.xmlDoc.documentElement.outerHTML

        switch (method) {
            case "PUT":
                return this.context.api.router.updateConceptItem(id, conceptItem)
            case "POST":
                return this.context.api.router.createConceptItem(conceptItem)
        }

    }


    render($$) {

        const el = $$('div').addClass('tag-edit-base')

        const formContainer = $$('form')
            .addClass('concept-story__container clearfix')
            .ref('formContainer')
            .on('submit', (e) => {
                e.preventDefault()
                if (this.refs['storyNameInput'].val() !== "") {
                    this.onClose('save')
                }
            })

        const hiddenSubmitButtonToEnableEnterSubmit = $$('input')
            .attr({type: 'submit', style: 'display:none'})
        formContainer.append(hiddenSubmitButtonToEnableEnterSubmit)

        formContainer.append(this.renderNameInput($$))
        formContainer.append(this.renderShortDescription($$))
        formContainer.append(this.renderLongDescription($$))


        el.append(formContainer)

        if (this.props.exists) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-info').append(
                this.getLabel('ximstory-name_already_in_use') + ": " + this.props.item.concept.name)))
        }

        if (this.state.error) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-error').append(
                this.getLabel("ximstory-error-save"))))
        }

        return el
    }


    renderNameInput($$) {
        // Name
        const nameInput = $$('input').attr({
            type: 'text',
            id: 'storyNameInput'
        })
            .addClass('form-control').val(this.props.item.concept.name)
            .ref('storyNameInput')

        nameInput.on('change', function () {
            if (this.refs['storyNameInput'].val() === "") {
                this.send("dialog:disablePrimaryBtn")
            } else {
                this.send("dialog:enablePrimaryBtn")
            }
        }.bind(this))

        const formGroup = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupName')
        formGroup.append($$('label').attr('for', 'storyNameInput').append(this.getLabel('ximstory-Name')))
        formGroup.append(nameInput)
        return formGroup
    }


    /**
     * Render a short description form fieldset
     * @returns {Component}
     */
    renderShortDescription($$) {
        const shortDescription = this.context.api.concept.getDefinitionForType(this.props.item.concept.definition, 'drol:short')
        let shortDescriptionValue = ""
        if (shortDescription) {
            shortDescriptionValue = shortDescription['keyValue']
        }

        // Short Desc
        const shortDescInput = $$('input').attr({id: 'storyShortDescInput'})
            .addClass('form-control')
            .val(shortDescriptionValue)
            .ref('storyShortDescInput')

        const formGroupShortDesc = $$('fieldset')
            .addClass('form-group col-xs-6')
            .ref('formGroupShortDesc')
        formGroupShortDesc.append($$('label')
            .attr('for', 'storyShortDescInput')
            .append(this.getLabel('ximstory-short_description')))
        formGroupShortDesc.append(shortDescInput)

        return formGroupShortDesc
    }


    /**
     * Render form group for long description
     * @returns {*}
     */
    renderLongDescription($$) {

        const longDescription = this.context.api.concept.getDefinitionForType(this.props.item.concept.definition, 'drol:long')
        let longDescriptionValue = ""

        if (longDescription) {
            longDescriptionValue = longDescription.keyValue
        }
        const longDescText = $$('textarea').attr({
            id: 'storyLongDescText'
        })
            .addClass('form-control')
            .val(longDescriptionValue)
            .ref('storyLongDescText')

        const formGroupLongDesc = $$('fieldset').addClass('form-group col-xs-12').ref('formGroupLongDesc')
        formGroupLongDesc.append($$('label')
            .attr('for', 'storyLongDescText')
            .append(this.getLabel('ximstory-long_description')))
        formGroupLongDesc.append(longDescText)
        return formGroupLongDesc
    }

    onClose(status) {
        if ('cancel' === status) {
            return true
        }

        if (this.props.newLocation) {
            this.createLocation()
        } else {
            this.updateLocation()
        }

        return false
    }

}

export default StoryEditComponent
