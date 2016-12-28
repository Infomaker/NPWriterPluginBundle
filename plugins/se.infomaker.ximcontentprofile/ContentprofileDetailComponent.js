import {Component} from 'substance'
import {lodash, jxon} from 'writer'

const isArray = lodash.isArray
const isObject = lodash.isObject
const find = lodash.find

class ContentprofileDetailComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    dispose() {
        super.dispose()
    }

    createContentProfile() {
        const contentProfile = this.props.contentProfile

        this.saveContentProfile(null, 'POST')
            .then((uuid) => {
                // Create link in newsItem
                this.context.api.newsItem.addConceptProfile(this.name, {
                    title: contentProfile.concept.name,
                    uuid: uuid
                })

                if (this.state.error) {
                    this.setState({error: false})
                }

                this.props.reload()
                this.send('close')
            })
            .catch(() => {
                this.setState({error: true})
            })
    }

    updateContentProfile() {
        const contentProfile = this.props.contentProfile;
        const uuid = contentProfile['@guid'] ? contentProfile['@guid'] : null

        if (!uuid) {
            throw new Error("ConceptItem has no UUID to update")
        }

        const shouldUpdateNewsItem = this.refs.contentProfileNameInput.val() !== contentProfile.concept.name

        // TODO: Handle response of PUT as in StoryEditComponent...
        this.saveContentProfile(uuid, 'PUT')
            .then(() => {
                if (shouldUpdateNewsItem) {
                    // Update link in newsItem
                    this.context.api.newsItem.updateConceptProfile(this.name, {
                        title: contentProfile.concept.name,
                        uuid: uuid
                    })
                }

                if (this.state.error) {
                    this.setState({error: false})
                }

                this.props.reload()
                this.send('close')
            })
            .catch(() => {
                this.setState({error: true});
            })
    }

    setDescription(inputValue, role) {
        let currentDescription = this.context.api.concept.getDefinitionForType(
            this.props.contentProfile.concept.definition, role
        )

        if (inputValue.length > 0 && !currentDescription) {
            const longDesc = {
                '@role': role,
                keyValue: inputValue
            }

            this.props.contentProfile.concept.definition = this.conceptUtil.setDefinitionDependingOnArrayOrObject(
                this.props.contentProfile.concept.definition, longDesc
            )
        } else if (inputValue.length >= 0 && currentDescription) {
            currentDescription['keyValue'] = inputValue
        }
    }

    saveContentProfile(id, method) {
        let contentProfile = this.props.contentProfile

        contentProfile.concept.name = this.refs.contentProfileNameInput.val().length > 0 ?
            this.refs.contentProfileNameInput.val() : contentProfile.concept.name

        var shortDescriptionInputValue = this.refs.contentProfileShortDescInput.val()
        var longDescriptionInputValue = this.refs.contentProfileLongDescText.val()

        // Check if definition exists
        if (!contentProfile.concept.definition) {
            contentProfile.concept.definition = []
        }

        this.setDescription(shortDescriptionInputValue, 'drol:short')
        this.setDescription(longDescriptionInputValue, 'drol:long')

        this.xmlDoc = jxon.unbuild(contentProfile, null, 'conceptItem')

        const conceptItem = this.xmlDoc.documentElement.outerHTML

        switch (method) {
            case "PUT":
                return this.context.api.router.updateConceptItem(id, conceptItem)
            case "POST":
                return this.context.api.router.createConceptItem(conceptItem)
        }
    }

    getDescription(descriptionType) {
        const contentProfile = this.props.contentProfile.concept

        if (!contentProfile.definition) {
            return undefined
        }

        if (isArray(contentProfile.definition)) {
            return find(contentProfile.definition, function (definition) {
                return definition['@role'] === descriptionType
            })
        } else if (isObject(contentProfile.definition)) {
            return contentProfile.definition['@role'] === descriptionType ? contentProfile.definition : undefined
        }
    }

    getNameForContentProfile() {
        return this.props.contentProfile.concept.name
    }

    render($$) {
        const name = this.getNameForContentProfile()

        let shortDesc = this.getDescription('drol:short')
        let longDesc = this.getDescription('drol:long')

        const el = $$('div')

        // TODO: scss classes?
        const formContainer = $$('form')
            .addClass('location-form__container clearfix').ref('formContainer')
            .on('submit', (e) => {
                e.preventDefault()

                if (this.refs['contentProfileNameInput'].val() !== "") {
                    this.onClose('save')
                }
            })

        const hiddenSubmitButtonToEnableEnterSubmit = $$('input').attr({type: 'submit', style: 'display:none'})
        formContainer.append(hiddenSubmitButtonToEnableEnterSubmit)

        // Name
        const formGroup = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupName')
        formGroup.append($$('label').attr('for', 'contentProfileNameInput').append(this.getLabel('Name')))

        if (this.props.editable) {
            const contentProfileName = $$('input').attr(
                {
                    type: 'text',
                    id: 'contentProfileNameInput'
                }
            ).addClass('form-control').val(name).ref('contentProfileNameInput')

            contentProfileName.on('change', function () {
                if (this.refs['contentProfileNameInput'].val() === "") {
                    this.send("dialog:disablePrimaryBtn")
                } else {
                    this.send("dialog:enablePrimaryBtn")
                }
            }.bind(this))

            formGroup.append(contentProfileName)
        }
        else {
            formGroup.append(
                $$('p').append(name).ref('contentProfileNameP')
            )
        }

        formContainer.append(formGroup)

        // Short description
        const formGroupShortDesc = $$('fieldset').addClass('form-group col-xs-6').ref('formGroupShortDesc')
        formGroupShortDesc.append(
            $$('label').attr('for', 'contentProfileShortDescInput')
                .append(this.getLabel('Short description'))
        )

        if (this.props.editable) {
            formGroupShortDesc.append(
                $$('input').attr(
                    {
                        id: 'contentProfileShortDescInput'
                    }
                ).addClass('form-control').val(shortDesc['keyValue']).ref('contentProfileShortDescInput')
            )
        }
        else {
            formGroupShortDesc.append(
                $$('p').append(shortDesc['keyValue']).ref('contentProfileShortDescP')
            )
        }
        formContainer.append(formGroupShortDesc)

        // Long description
        const formGroupLongDesc = $$('fieldset').addClass('form-group col-xs-12').ref('formGroupLongDesc')
        formGroupLongDesc.append(
            $$('label').attr('for', 'contentProfileLongDescText')
                .append(this.getLabel('Long description'))
        )

        if (this.props.editable) {
            formGroupLongDesc.append(
                $$('textarea').attr(
                    {
                        id: 'contentProfileLongDescText'
                    }
                ).addClass('form-control').val(longDesc['keyValue']).ref('contentProfileLongDescText')
            )
        }
        else {
            formGroupLongDesc.append(
                $$('p').append(longDesc['keyValue']).ref('contentProfileLongDescP')
            )
        }
        formContainer.append(formGroupLongDesc)

        el.append(formContainer)
        return el
    }

    onClose(status) {
        if ('cancel' === status || this.props.editable === false) {
            return true
        }

        if (this.props.exists) {
            this.updateContentProfile()
        } else {
            this.createContentProfile()
        }

        return false
    }
}

export default ContentprofileDetailComponent
