import TagEditBaseComponent from './TagEditBaseComponent'
import {jxon} from 'writer'

class TagEditPersonComponent extends TagEditBaseComponent {

    constructor(...args) {
        super(...args)
        this.name = 'mmtags'
    }


    save() {
        const tag = this.props.tag,
            firstName = this.refs.firstNameInput.val(),
            lastName = this.refs.lastNameInput.val(),
            shortDesc = this.refs.shortDescInput.val(),
            longDesc = this.refs.longDescTextarea.val(),
            uuid = tag['@guid'] ? tag['@guid'] : null,
            fullName = firstName + " " + lastName

        tag.concept.name = fullName;

        // Make JSON to XML
        const xmlTag = jxon.unbuild(tag, null, 'conceptItem')
        this.xmlDoc = xmlTag

        // Name
        const firstNameNode = xmlTag.documentElement.querySelector('itemMetaExtProperty[type="imext:firstName"]')
        const lastNameNode = xmlTag.documentElement.querySelector('itemMetaExtProperty[type="imext:lastName"]')
        firstNameNode.setAttribute('value', firstName);
        lastNameNode.setAttribute('value', lastName);

        // Description
        const shortDescNode = TagEditBaseComponent.getShortDescription(xmlTag),
            longDescNode = TagEditBaseComponent.getLongDescription(xmlTag)
        shortDescNode.textContent = shortDesc
        longDescNode.textContent = longDesc


        // Social
        this.updateWebsite(this.refs.urlInput.val())
        this.updateTwitter(this.refs.twitterInput.val())
        this.updateFacebook(this.refs.facebookInput.val())

        if (uuid === null) {
            this.createConcept(xmlTag.documentElement.outerHTML)
                .then((uuid) => {

                    this.xmlDoc.querySelector('conceptItem').setAttribute('guid', uuid)
                    this.context.api.newsItem.addTag(this.name, {
                        uuid: uuid,
                        name: [fullName],
                        type: ['person'],
                        imType: ['x-im/person']
                    })
                    if (this.state.error) {
                        this.extendState({error: false})
                    }
                    this.closeAndReload()
                })
                .catch(() => this.extendState({error: true}))

        } else {
            this.saveConcept(uuid, xmlTag.documentElement.outerHTML)
                .then(() => {
                    // If save is done, update the tag in article newsitem
                    this.context.api.newsItem.updateTag(this.name, uuid, {
                        name: [fullName],
                        imType: [tag.type['@value']]
                    })
                    if (this.state.error) {
                        this.extendState({error: false})
                    }
                    this.closeAndReload()

                })
                .catch(() => this.extendState({error: true}));
        }
    }


    render($$) {
        const tag = this.props.tag,
            el = $$('div').addClass('tag-edit tag-edit-person').addClass('row'),

            firstName = this.renderElement("firstNameInput", 'First name', this.getItemMetaExtProperty('imext:firstName')['@value'], false, 'input'),
            lastName = this.renderElement("lastNameInput", 'Last name', this.getItemMetaExtProperty('imext:lastName')['@value'], false, 'input'),
            shortDesc = this.renderElement('shortDescInput',
                this.getLabel('mmtags-Short_description'),
                this.getConceptDefinition('drol:short').keyValue,
                true,
                'input'),
            longDesc = this.renderElement('longDescTextarea',
                this.getLabel('mmtags-Long_description'),
                this.getConceptDefinition('drol:long').keyValue,
                true,
                'textarea'),

            websiteUrl = this.getSeeAlsoLinkByType('text/html'),
            websiteUrlEl = this.renderElement('urlInput',
                this.getLabel('mmtags-Website_url'),
                websiteUrl ? websiteUrl['@url'] : '',
                true,
                'input'),

            twitterUrl = this.getSeeAlsoLinkByType('x-im/social+twitter'),
            twitterEl = this.renderElement('twitterInput',
                this.getLabel('mmtags-Twitter_url'),
                twitterUrl ? twitterUrl['@url'] : '',
                false,
                'input'),

            facebook = this.getSeeAlsoLinkByType('x-im/social+facebook'),
            facebookEl = this.renderElement('facebookInput',
                this.getLabel('mmtags-Facebook_url'),
                facebook ? facebook['@url'] : '',
                false,
                'input')

        firstName.on('change', () => {
            if (this.refs['firstNameInput'].val() === "") {
                this.send("dialog:disablePrimaryBtn")
            } else {
                this.send("dialog:enablePrimaryBtn")
            }
        })

        el.append([firstName, lastName, shortDesc, longDesc, websiteUrlEl, twitterEl, facebookEl])

        if (this.state.error) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-error').append(
                this.getLabel("mmtags-error-save"))))
        }

        return el
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

export default TagEditPersonComponent