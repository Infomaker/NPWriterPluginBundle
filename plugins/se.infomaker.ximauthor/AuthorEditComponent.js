import {jxon} from 'writer'
import FieldSetBaseComponent from './FieldSetBaseComponent'
import AuthorBaseComponent from './AuthorBaseComponent'

const REF_FIRST_NAME = 'firstNameInput'
const REF_LAST_NAME = 'lastNameInput'
const REF_SHORT_DESC = 'shortDescInput'
const REF_LONG_DESC = 'longDescInput'
const REF_EMAIL = 'emailInput'
const REF_PHONE = 'phoneInput'
const REF_SEE_ALSO_LINK_FACEBOOK = 'facebookLinkInput'
const REF_SEE_ALSO_LINK_TWITTER = 'twitterLinkInput'

/**
 * Component for creating and editing authors as concepts.
 */
class AuthorEditComponent extends AuthorBaseComponent {

    constructor(...args) {
        super(...args)
        this.name = 'ximauthor'
    }

    didMount() {
        this.refs['outer-' + REF_FIRST_NAME].refs[REF_FIRST_NAME].getNativeElement().focus()
    }

    getInitialState() {
        return {
            author: this.props.author
        }
    }

    render($$) {
        const el = $$('div').addClass('author-edit author-edit-person').addClass('row')

        const firstName = this._createInputComponent(
            $$,
            this.getLabel('First name'),
            this.getItemMetaExtProperty('imext:firstName'),
            REF_FIRST_NAME,
            'col-sm-6',
            false
        )

        const lastName = this._createInputComponent(
            $$,
            this.getLabel('Last name'),
            this.getItemMetaExtProperty('imext:lastName'),
            REF_LAST_NAME,
            'col-sm-6',
            false
        )

        const email = this._createInputComponent(
            $$,
            this.getLabel('Email'),
            this.getDataElement('email'),
            REF_EMAIL,
            'col-sm-6',
            false
        )

        const phone = this._createInputComponent(
            $$,
            this.getLabel('Phone'),
            this.getDataElement('phone'),
            REF_PHONE,
            'col-sm-6',
            false
        )

        const facebookLink = this._createInputComponent(
            $$,
            this.getLabel('Facebook'),
            this.getItemMetaLinkAttribute('x-im/social+facebook', 'url'),
            REF_SEE_ALSO_LINK_FACEBOOK,
            'col-12',
            false
        )

        const twitterLink = this._createInputComponent(
            $$,
            this.getLabel('Twitter'),
            this.getItemMetaLinkAttribute('x-im/social+twitter', 'url'),
            REF_SEE_ALSO_LINK_TWITTER,
            'col-12',
            false
        )

        const shortDesc = this._createInputComponent(
            $$,
            this.getLabel('Short description'),
            this.getDefinition('drol:short'),
            REF_SHORT_DESC,
            'col-12',
            false
        )

        const longDesc = this._createInputComponent(
            $$,
            this.getLabel('Long description'),
            this.getDefinition('drol:long'),
            REF_LONG_DESC,
            'col-12',
            true
        )

        el.append([firstName, lastName, email, phone, facebookLink, twitterLink, shortDesc, longDesc])

        return el
    }

    onClose(status) {
        if (status === 'save') {
            this.save()
            return false
        }
    }

    closeAndReload() {
        this.props.close();
        this.send('close');
    }

    save() {
        const author = this.props.author
        const uuid = author['@guid'] ? author['@guid'] : null

        const firstNameVal = this._getComponentValue(REF_FIRST_NAME)
        const lastNameVal = this._getComponentValue(REF_LAST_NAME)

        const emailVal = this._getComponentValue(REF_EMAIL)
        const phoneVal = this._getComponentValue(REF_PHONE)

        const facebookLinkVal = this._getComponentValue(REF_SEE_ALSO_LINK_FACEBOOK)
        const twitterLinkVal = this._getComponentValue(REF_SEE_ALSO_LINK_TWITTER)

        const shortDescVal = this._getComponentValue(REF_SHORT_DESC)
        const longDescVal = this._getComponentValue(REF_LONG_DESC)

        const fullNameVal = firstNameVal + ' ' + lastNameVal

        // Make json to xml
        let authorConcept
        try {
            authorConcept = jxon.unbuild(author, null, 'conceptItem')
        } catch (e) {
            console.error(e)
            this._setError(this.getLabel('ximauthors-error-internal'))
            return
        }

        // Update xml
        try {
            this._updateItemMetaExtPropertyNode(authorConcept, 'imext:firstName', firstNameVal)
            this._updateItemMetaExtPropertyNode(authorConcept, 'imext:lastName', lastNameVal)

            this._updateNameNode(authorConcept, fullNameVal)

            this._updateDataChildNode(authorConcept, 'email', emailVal)
            this._updateDataChildNode(authorConcept, 'phone', phoneVal)

            this._updateLinkNode(authorConcept, 'irel:seeAlso', 'x-im/social+facebook', facebookLinkVal, null)
            this._updateLinkNode(authorConcept, 'irel:seeAlso', 'x-im/social+twitter', twitterLinkVal, null)

            this._updateDefinition(authorConcept, 'drol:short', shortDescVal)
            this._updateDefinition(authorConcept, 'drol:long', longDescVal)
        } catch (e) {
            console.error(e)
            this._setError(this.getLabel('ximauthors-error-internal'))
            return
        }

        if (!uuid) {
            this._createAuthorConcept(authorConcept, fullNameVal)
        } else {
            this._updateAuthorConcept(uuid, authorConcept)
        }
    }

    _createInputComponent($$, label, value, refName, cssClass, isTextArea) {
        return $$(FieldSetBaseComponent, {
            label: label,
            inputValue: value,
            refName: refName,
            cssClass: cssClass,
            validationFn: (label, refName, value) => this._validateComponentValue(label, refName, value),
            isTextArea: isTextArea ? isTextArea : false
        }).ref('outer-' + refName)
    }

    _validateComponentValue(label, refName, value) {
        let message = ''

        switch (refName) {
            case REF_SEE_ALSO_LINK_FACEBOOK:
            case REF_SEE_ALSO_LINK_TWITTER: {
                if (value && !this._validateURL(value)) {
                    this._addError(label)
                    message = this.getLabel('ximauthors-invalid-url')
                } else {
                    this._removeError(label)
                }
                break
            }
            case REF_EMAIL: {
                if (value && !this._validateEmail(value)) {
                    this._addError(label)
                    message = this.getLabel('ximauthors-invalid-email')
                } else {
                    this._removeError(label)
                }
                break
            }
            case REF_PHONE: {
                if (value && !this._validatePhone(value)) {
                    this._addError(label)
                    message = this.getLabel('ximauthors-invalid-phone')
                } else {
                    this._removeError(label)
                }
                break
            }
        }

        this._toggleSaveButton()

        return message
    }

    _componentHasErrors() {
        return this.state.errors && this.state.errors.length > 0
    }

    _toggleSaveButton() {
        let enableSaveMessage = 'dialog:enablePrimaryBtn'

        if (this._componentHasErrors()) {
            enableSaveMessage = 'dialog:disablePrimaryBtn'
        } else {
            const fnVal = this._getComponentValue(REF_FIRST_NAME)
            const lnVal = this._getComponentValue(REF_LAST_NAME)
            enableSaveMessage = fnVal && lnVal ? 'dialog:enablePrimaryBtn' : 'dialog:disablePrimaryBtn'
        }

        this.send(enableSaveMessage)
    }

    _validateURL(url) {
        return (/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/.test(url))
    }

    _validateEmail(email) {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    }

    _validatePhone(phone) {
        return (/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(phone))
    }

    _setError(error) {
        const errors = [error]
        this.extendState({errors: errors})
    }

    _addError(error) {
        this._removeError(error)
        let errors = this.state.errors ? this.state.errors : []

        errors.push(error)
        this.extendState({errors: errors})
    }

    _removeError(error) {
        if (this.state.errors) {
            const index = this.state.errors.indexOf(error)
            if (index > -1) {
                let errors = this.state.errors
                errors.splice(index, 1)
                this.extendState({errors: errors})
            }
        }
    }

    _getComponentValue(refName) {
        return this.refs['outer-' + refName].refs[refName].val()
    }

    /**
     * Creates author concept and add author link to newsItem.
     *
     * @param authorDocument Author concept.
     * @param fullName      First and last name of author.
     * @private
     */
    _createAuthorConcept(authorDocument, fullName) {
        this.context.api.router.createConceptItem(authorDocument.documentElement.outerHTML)
            .then((uuid) => {
                authorDocument.querySelector('conceptItem').setAttribute('guid', uuid)

                this.context.api.newsItem.addAuthor(this.name, {
                    uuid: uuid,
                    name: fullName
                })

                if (this._componentHasErrors()) {
                    this.extendState({errors: null})
                }

                // AuthorItemComponent will update links in article
                this.closeAndReload()
            })
            .catch(() => {
                console.error('Error creating concept with xml:', authorDocument.documentElement.outerHTML)
                this._setError(this.getLabel('ximauthors-error-save'))
            })
    }

    /**
     * Updates author concept and author link in newsItem
     *
     * @param uuid          UUID for author concept.
     * @param authorConcept Author concept.
     * @param email         Email of author.
     * @private
     */
    _updateAuthorConcept(uuid, authorConcept) {
        this.context.api.router.updateConceptItem(uuid, authorConcept.documentElement.outerHTML)
            .then(() => {
                if (this._componentHasErrors()) {
                    this.extendState({errors: null})
                }

                // AuthorItemComponent will update links in article
                this.closeAndReload()
            })
            .catch(() => {
                console.error('Error updating concept with xml:', authorConcept.documentElement.outerHTML)
                this._setError(this.getLabel('ximauthors-error-update'))
            });
    }

    _updateNameNode(authorConcept, value) {
        const nameNode = this._getSafeNameNode(authorConcept)
        nameNode.textContent = value
    }

    _updateItemMetaExtPropertyNode(authorConcept, type, value) {
        let extProperty = this._getItemMetaExtPropertyNode(authorConcept, type)

        if (!extProperty) {
            extProperty = authorConcept.createElement('itemMetaExtProperty')
            authorConcept.documentElement.querySelector('itemMeta').appendChild(extProperty)
        }

        extProperty.setAttribute('value', value)
    }

    /**
     * Remove any existing link node of specified 'type'. If either 'url' or 'uri'
     * a new link of 'type' will be created and added.
     *
     * @param authorConcept Author concept xml.
     * @param rel       Attribute 'rel'.
     * @param type      Attribute 'type'.
     * @param url       Attribute 'url'.
     * @param uri       Attribute 'uri'.
     * @private
     */
    _updateLinkNode(authorConcept, rel, type, url, uri) {
        const linksNode = this._getSafeLinks(authorConcept)
        const removeLinkNode = linksNode.querySelector('link[type="' + type + '"]')

        if (removeLinkNode) {
            removeLinkNode.parentNode.removeChild(removeLinkNode)
        }

        if (url || uri) {
            const linkNode = authorConcept.createElement('link')

            linkNode.setAttribute('rel', rel)
            linkNode.setAttribute('type', type)

            if (url) {
                linkNode.setAttribute('url', url)
            }
            if (uri) {
                linkNode.setAttribute('uri', uri)
            }

            linksNode.appendChild(linkNode)
        }
    }

    _updateDataChildNode(authorConcept, nodeName, value) {
        let childNode = this._getDataChildNode(authorConcept, nodeName)

        if (value) {
            if (!childNode) {
                childNode = this._getSafeDataChildNode(authorConcept, nodeName)
            }
            childNode.textContent = value
        } else if (childNode) {
            childNode.parentNode.removeChild(childNode)
        }
    }

    _updateDefinition(authorConcept, role, value) {
        let definitionNode = authorConcept.documentElement.querySelector('concept > definition[role="' + role + '"]')

        if (!definitionNode) {
            definitionNode = authorConcept.createElement('definition')
            definitionNode.setAttribute('role', role)
            authorConcept.documentElement.querySelector('concept').appendChild(definitionNode)
        }

        definitionNode.textContent = value
    }

    _getSafeNameNode(authorXml) {
        let nameNode = authorXml.documentElement.querySelector('concept > name')

        if (!nameNode) {
            nameNode = authorXml.createElement('name')
            authorXml.documentElement.querySelector('concept').appendChild(nameNode)
        }

        return nameNode
    }

    _getItemMetaExtPropertyNode(authorXml, type) {
        return authorXml.documentElement.querySelector('itemMetaExtProperty[type="' + type + '"]')
    }

    _getDataChildNode(authorXml, nodeName) {
        return this._getSafeDataNode(authorXml).querySelector(nodeName)
    }

    _getSafeDataChildNode(authorXml, nodeName) {
        let node = this._getDataChildNode(authorXml, nodeName)

        if (!node) {
            node = authorXml.createElement(nodeName)
            this._getSafeDataNode(authorXml).appendChild(node)
        }

        return node
    }

    _getSafeDataNode(authorXml) {
        const contactInfoObject = this._getSafeContactInfoObjectNode(authorXml)

        let dataNode = contactInfoObject.querySelector('data')
        if (!dataNode) {
            dataNode = authorXml.createElement('data')
            contactInfoObject.appendChild(dataNode)
        }

        return dataNode
    }

    _getSafeContactInfoObjectNode(authorXml) {
        const metadataNode = this._getSafeMetadataNode(authorXml)

        let objectNode = metadataNode.querySelector('object[type="x-im/contact-info"]')
        if (!objectNode) {
            objectNode = authorXml.createElement('object')
            objectNode.setAttribute('type', 'x-im/contact-info')
            objectNode.setAttribute('id', 'KaPjxsuzpQz8')

            metadataNode.appendChild(objectNode)
        }

        return objectNode
    }

    _getSafeMetadataNode(authorXml) {
        let metadataNode = authorXml.documentElement.querySelector('concept > metadata')

        if (!metadataNode) {
            metadataNode = authorXml.createElement('metadata')
            metadataNode.setAttribute('xmlns', 'http://www.infomaker.se/newsml/1.0')
            authorXml.documentElement.querySelector('concept').appendChild(metadataNode)
        }

        return metadataNode
    }

    _getSafeLinks(authorXml) {
        let links = authorXml.documentElement.querySelector('itemMeta > links')

        if (!links) {
            links = authorXml.createElement('links')
            links.setAttribute('xmlns', 'http://www.infomaker.se/newsml/1.0')
            authorXml.documentElement.querySelector('itemMeta').appendChild(links)
        }

        return links
    }
}

export default AuthorEditComponent