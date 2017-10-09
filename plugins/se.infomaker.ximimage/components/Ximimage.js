import {Component, TextPropertyEditor, FontAwesomeIcon} from "substance";
import {NilUUID} from "writer";
import ImageDisplay from "./ImageDisplay";

const {api} = writer

class XimimageComponent extends Component {

    didMount() {
        this.props.node.fetchAuthorsConcept()
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id) ||
            change.isAffected(this.props.node.imageFile)) {
            this.rerender()
        }
    }

    grabFocus() {
        let caption = this.refs.caption
        if(caption) {
            this.context.editorSession.setSelection({
                type: 'property',
                path: caption.getPath(),
                startOffset: 0,
                surfaceId: caption.id
            })
        }
    }
    render($$) {
        let node = this.props.node
        let el = $$('div').addClass('sc-ximimage im-blocknode__container')
        let fields = api.getConfigValue('se.infomaker.ximimage', 'fields')

        // TODO: extract from full config when we can get that
        const imageOptions = ['byline', 'imageinfo', 'softcrop', 'crops', 'bylinesearch'].reduce((optionsObject, field) => {
            optionsObject[field] = api.getConfigValue('se.infomaker.ximimage', field)
            return optionsObject
        }, {})

        el.append(
            $$(ImageDisplay, {
                parentId: 'se.infomaker.ximimage',
                node: node,
                imageOptions,
                isolatedNodeState: this.props.isolatedNodeState,
            }).ref('image')
        )

        this.renderAuthors($$, el)

        fields.forEach(obj => {
            if (obj.type === 'option') {
                el.append(this.renderOptionField($$, obj))
            }
            else {
                el.append(this.renderTextField($$, obj))
            }
        })

        return el
    }

    renderAuthors($$, el) {
        if (api.getConfigValue('se.infomaker.ximimage', 'byline')) {
            const authorList = $$('ul')
                .addClass('dialog-image-authorlist')
                .attr('contenteditable', false);

            this.props.node.authors.forEach((item) => {
                const authorItem = this.renderAuthor($$, item);
                if (authorItem) {
                    authorList.append(authorItem);
                }
            })

            el.append($$('div')
                .attr('contenteditable', false)
                .addClass('x-im-image-authors')
                .append(
                    authorList
                ))
        }
    }


    renderAuthor($$, author) {

        const Avatar = api.ui.getComponent('avatar')

        let twitterHandle
        if(author.isLoaded && author.links && author.links.link) {
            const twitterLink = Avatar._getLinkForType(author.links.link, 'x-im/social+twitter')
            if(twitterLink) {
                const twitterURL = Avatar._getTwitterUrlFromAuhtorLink(twitterLink)
                twitterHandle = Avatar._getTwitterHandleFromTwitterUrl(twitterURL)
            }
        }

        const refid = (NilUUID.isNilUUID(author.uuid)) ? author.name : author.uuid;
        const avatarEl = $$(Avatar, {avatarSource: 'twitter', avatarId: twitterHandle}).ref('avatar-'+refid)
        return $$('li').append(
            $$('div').append([
                avatarEl,
                $$('div').append([
                    $$('strong').append(author.name),
                    //$$('em').append(this.authors[n].data.email ? this.authors[n].data.email : '')
                ]),
                $$('span').append(
                    $$('a').append(
                        $$(FontAwesomeIcon, {icon: 'fa-times'})
                    )
                        .attr('title', this.getLabel('Remove'))
                        .on('click', () => {
                            this.removeAuthor(author)
                        })
                )
            ]).ref('container-'+refid)
        ).ref('item-' + refid);

    }

    removeAuthor(author) {
        const refid = (NilUUID.isNilUUID(author.uuid)) ? author.name : author.uuid

        delete this.refs['item-' + refid]

        const authors = this.props.node.authors
        for (let n = 0; n < authors.length; n++) {

            if (!NilUUID.isNilUUID(author.uuid) && authors[n].uuid === author.uuid) {
                authors.splice(n, 1)
                break
            }
            else if (NilUUID.isNilUUID(author.uuid) && authors[n].name === author.name) {
                authors.splice(n, 1)
                break
            }
        }

        this.props.node.setAuthors(authors)
    }


    renderTextField($$, obj) {
        const FieldEditor = this.context.api.ui.getComponent('field-editor')
        return $$(FieldEditor, {
            node: this.props.node,
            field: obj.name,
            multiLine: false,
            disabled: Boolean(this.props.disabled),
            placeholder: obj.label,
            icon: this._getFieldIcon(obj.name) || 'fa-header'
        })
            .ref(obj.name)
            .attr('title', obj.label)
            .addClass('x-im-image-dynamic')
    }

    _getFieldIcon(name) {
        const icons = {
            caption: 'fa-align-left',
            credit: 'fa-building-o',
            alttext: 'fa-low-vision'
        }

        return icons[name]
    }

    renderOptionField($$, obj) {
        let options = [],
            currentOption = null

        if (!this.props.node.alignment) {
            currentOption = obj.options[0].name
            // this.props.node.setAlignment(currentOption)
        }
        else {
            currentOption = this.props.node.alignment
        }

        obj.options.forEach(option => {
            let selectedClass = (currentOption === option.name) ? ' selected' : ''

            options.push(
                $$('em')
                    .addClass('fa ' + option.icon + selectedClass)
                    .attr({
                        'contenteditable': 'false',
                        'title': option.label
                    })
                    .on('click', () => {
                        if (option.name !== this.props.node.alignment) {
                            this.props.node.setAlignment(option.name)
                            this.rerender()
                        }
                        return false
                    })
            );
        });

        return $$('div')
            .addClass('x-im-image-dynamic x-im-image-alignment')
            .attr({
                'contenteditable': 'false'
            })
            .append(options)
    }
}

export default XimimageComponent
