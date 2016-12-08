import TagEditBaseComponent from './TagEditBaseComponent'
import {jxon} from 'writer'

class TagEditTopicComponent extends TagEditBaseComponent {

    constructor(...args) {
        super(...args)
        this.name = 'mmtags'
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


        if (uuid === null) {
            this.createConcept(xmlTag.documentElement.outerHTML)
                .then((uuid) => {

                    this.xmlDoc.querySelector('conceptItem').setAttribute('guid', uuid)
                    this.context.api.newsItem.addTag(this.name, {
                        uuid: uuid,
                        name: [name],
                        type: ['organisation'],
                        imType: ['x-im/topic']
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
                this.getLabel('mmtags-Short_description'),
                this.getConceptDefinition('drol:short').keyValue,
                true,
                'input'),
            longDesc = this.renderElement($$, 'longDescTextarea',
                this.getLabel('mmtags-Long_description'),
                this.getConceptDefinition('drol:long').keyValue,
                true,
                'textarea')


        name.on('change', () => {
            if (this.refs['nameInput'].val() === "") {
                this.send("dialog:disablePrimaryBtn")
            } else {
                this.send("dialog:enablePrimaryBtn")
            }
        })

        el.append([name, shortDesc, longDesc])

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

export default TagEditTopicComponent