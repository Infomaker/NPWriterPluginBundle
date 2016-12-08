import TagEditBaseComponent from './TagEditBaseComponent'
import {jxon} from 'writer'

class TagEditCompanyComponent extends TagEditBaseComponent {

    constructor(...args) {
        super(...args)
        this.name = 'ximtags'
    }


    save() {
        const tag = this.props.tag,
            name = this.refs.nameInput.val(),
            shortDesc = this.refs.shortDescInput.val(),
            longDesc = this.refs.longDescTextarea.val(),
            uuid = tag['@guid'] ? tag['@guid'] : null

        tag.concept.name = name

        // Make JSON to XML
        const xmlTag = jxon.unbuild(tag, null, 'conceptItem')
        this.xmlDoc = xmlTag

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
                        name: [name],
                        type: ['organisation'],
                        imType: ['x-im/organisation']
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
                        name: [name],
                        imType: [tag.type['@value']]
                    })
                    if (this.state.error) {
                        this.extendState({error: false})
                    }
                    this.closeAndReload()

                })
                .catch(() => this.extendState({error: true}))
        }
    }


    render($$) {
        const tag = this.props.tag,
            el = $$('div').addClass('tag-edit tag-edit-person').addClass('row'),

            name = this.renderElement($$, "nameInput", 'Name', tag.concept.name, true, 'input'),
            shortDesc = this.renderElement($$, 'shortDescInput',
                this.getLabel('ximtags-Short_description'),
                this.getConceptDefinition('drol:short').keyValue,
                true,
                'input'),
            longDesc = this.renderElement($$, 'longDescTextarea',
                this.getLabel('ximtags-Long_description'),
                this.getConceptDefinition('drol:long').keyValue,
                true,
                'textarea'),

            websiteUrl = this.getSeeAlsoLinkByType('text/html'),
            websiteUrlEl = this.renderElement($$, 'urlInput',
                this.getLabel('ximtags-Website_url'),
                websiteUrl ? websiteUrl['@url'] : '',
                true,
                'input'),

            twitterUrl = this.getSeeAlsoLinkByType('x-im/social+twitter'),
            twitterEl = this.renderElement($$, 'twitterInput',
                this.getLabel('ximtags-Twitter_url'),
                twitterUrl ? twitterUrl['@url'] : '',
                false,
                'input'),

            facebook = this.getSeeAlsoLinkByType('x-im/social+facebook'),
            facebookEl = this.renderElement($$, 'facebookInput',
                this.getLabel('ximtags-Facebook_url'),
                facebook ? facebook['@url'] : '',
                false,
                'input')

        name.on('change', () => {
            if (this.refs['nameInput'].val() === "") {
                this.send("dialog:disablePrimaryBtn")
            } else {
                this.send("dialog:enablePrimaryBtn")
            }
        })

        el.append([name, shortDesc, longDesc, websiteUrlEl, twitterEl, facebookEl])

        if (this.state.error) {
            el.append($$('div').addClass('pad-top').append($$('div').addClass('alert alert-error').append(
                this.getLabel("ximtags-error-save"))))
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

export default TagEditCompanyComponent