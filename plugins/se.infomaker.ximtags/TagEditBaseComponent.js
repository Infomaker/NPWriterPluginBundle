import {Component, FontAwesomeIcon as Icon} from 'substance'
import {lodash} from 'writer'

const find = lodash.find

class TagEditBaseComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximtags'
    }

    saveConcept(uuid, newsItem) {
        return this.context.api.router.updateConceptItem(uuid, newsItem)

    }

    createConcept(newsItem) {
        return this.context.api.router.createConceptItem(newsItem)
    }

    shouldRerender() {
        return false;
    }

    /**
     * Creates, updates or delete an facebook link
     * @param facebookInputValue
     */
    updateFacebook(facebookInputValue) {
        const facebookNode = this.xmlDoc.documentElement.querySelector('itemMeta links link[rel="irel:seeAlso"][type="x-im/social+facebook"]')
        if (facebookInputValue.length > 0 && !facebookNode) {
            this.createLinkNode(this.xmlDoc, {
                type: 'x-im/social+facebook',
                rel: 'irel:seeAlso',
                url: facebookInputValue
            })
        } else if (facebookNode && facebookInputValue.length > 0) {
            facebookNode.setAttribute('url', facebookInputValue)
        } else if (facebookInputValue.length === 0 && facebookNode) {
            facebookNode.parentElement.removeChild(facebookNode)
        }
    }


    /**
     * Creates, updates or delete a twitter link
     * @param twitterInputValue
     */
    updateTwitter(twitterInputValue) {
        const twitterNode = this.xmlDoc.documentElement.querySelector('itemMeta links link[rel="irel:seeAlso"][type="x-im/social+twitter"]')
        if (twitterInputValue.length > 0 && !twitterNode) {
            this.createLinkNode(this.xmlDoc, {
                type: 'x-im/social+twitter',
                rel: 'irel:seeAlso',
                url: twitterInputValue
            })
        } else if (twitterNode && twitterInputValue.length > 0) {
            twitterNode.setAttribute('url', twitterInputValue)
        } else if (twitterInputValue.length === 0 && twitterNode) {
            twitterNode.parentElement.removeChild(twitterNode)
        }
    }

    /**
     * Creates, updates or delete a website link
     * @param websiteInputValue
     */
    updateWebsite(websiteInputValue) {
        const websiteNode = this.xmlDoc.documentElement.querySelector('itemMeta links link[rel="irel:seeAlso"][type="text/html"]')
        if (websiteInputValue.length > 0 && !websiteNode) {
            this.createLinkNode(this.xmlDoc, {type: 'text/html', rel: 'irel:seeAlso', url: websiteInputValue})
        } else if (websiteNode && websiteInputValue.length > 0) {
            websiteNode.setAttribute('url', websiteInputValue)
        } else if (websiteInputValue.length === 0 && websiteNode) {
            websiteNode.parentElement.removeChild(websiteNode)
        }
    }


    createLinkNode(xmlDoc, attributes) {
        const linkNode = xmlDoc.createElement('link')
        for (let key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                linkNode.setAttribute(key, attributes[key])
            }
        }
        xmlDoc.documentElement.querySelector('itemMeta links').appendChild(linkNode)

        return linkNode
    }


    /**
     * Search after specific type in itemMeta for concept
     * @param key
     * @returns {*}
     */
    getItemMetaExtProperty(key) {
        return find(this.props.tag.itemMeta.itemMetaExtProperty, (item) => item['@type'] === key)
    }

    getConceptDefinition(key) {
        return find(this.props.tag.concept.definition, (item) => item['@role'] === key)
    }

    getSeeAlsoLinkByType(type) {
        // fixme: should really use loadash...
        let links = this.props.tag.itemMeta.links.link

        let foundLink = null
        if (Array.isArray(links)) {
            links.forEach((link) => {
                if (link['@type'] === type && link['@rel'] === 'irel:seeAlso') {
                    foundLink = link
                }
            })
        } else if (links) {
            if (links['@type'] === type && links['@rel'] === 'irel:seeAlso') {
                foundLink = this.props.tag.itemMeta.links.link
            }
        }
        return foundLink
    }

    render($$) {
        const el = $$('div').addClass('tag-edit tag-edit-base')

        const personBtn = $$('button')
            .append($$(Icon, {icon: 'fa-user'}))
            .append($$('span')
                .append(this.getLabel('ximtags-Person')))
            .on('click', this.createPerson)

        const organisationBtn = $$('button')
            .append($$(Icon, {icon: 'fa-sitemap'}))
            .append($$('span')
                .append(this.getLabel('ximtags-Organization')))
            .on('click', this.createOrganisation)

        const topicBtn = $$('button')
            .append($$(Icon, {icon: 'fa-tags'}))
            .append($$('span')
                .append(this.getLabel('ximtags-Topic')))
            .on('click', this.createTopic)

        el.append($$('small').addClass('text-muted').append(this.getLabel('ximtags-type-question-label')))

        var buttons = []

        if (this.checkEditable('x-im/person')) {
            buttons.push(personBtn)
        }
        if (this.checkEditable("x-im/organisation")) {
            buttons.push(organisationBtn)
        }
        if (this.checkEditable("x-im/topic")) {
            buttons.push(topicBtn)
        }

        el.append(buttons)

        if (this.props.exists) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-info').append(
                this.getLabel("ximtags-name_already_in_use") + ": " + this.props.tag.value)))
        }

        if (this.state.error) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-error').append(
                this.getLabel("ximtags-error-save"))))
        }

        return el
    }

    checkEditable(type) {
        let tagConfig = this.props.tagsConfig
        return tagConfig[type] && tagConfig[type].editable
    }


    createPerson() {
        this.send('close')
        this.props.createPerson(this.props.tag.inputValue)
    }

    createOrganisation() {
        this.send('close')
        this.props.createOrganisation(this.props.tag.inputValue)
    }

    createTopic() {
        this.send('close')
        this.props.createTopic(this.props.tag.inputValue)
    }

    closeAndReload() {
        this.props.close(); // Let the TagItemComponent know that save is done
        this.send('close'); // Close the modal
    }


    renderElement($$, refName, label, inputValue, fullWidth, inputType) {
        const cssClass = fullWidth ? 'col-12' : 'col-sm-6'
        let input
        switch (inputType) {
            case 'textarea':
                input = this.getTextAreaElement($$)
                break
            default:
                input = this.getTextInputElement($$)
                break
        }
        const formGroup = $$('fieldset').addClass('form-group').addClass(cssClass)
        formGroup.append($$('label').append(label))
        formGroup.append(input.val(inputValue).ref(refName))
        return formGroup
    }

    /**
     * Generate an input of type text
     * @returns {*|this}
     */
    getTextInputElement($$) {
        return $$('input').attr('type', 'text').addClass('form-control')
    }


    /**
     * Generate a textarea form
     * @returns {component}
     */
    getTextAreaElement($$) {
        return $$('textarea').attr('rows', '4').addClass('form-control')
    }

    static getShortDescription(xmlTag) {
        return xmlTag.documentElement.querySelector('concept definition[role="drol:short"]')
    }

    static getLongDescription(xmlTag) {
        return xmlTag.documentElement.querySelector('concept definition[role="drol:long"]')
    }

    onClose(status) {

        if (status === "cancel") {
            return
        } else if (status === "save") {
            this.save()
            return false
        }

    }

}

export default TagEditBaseComponent