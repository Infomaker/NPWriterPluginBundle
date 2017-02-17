import { Component, FontAwesomeIcon } from "substance";
import { NilUUID, api } from "writer";
import Author from './Author'

class XimimageAddToBylineComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    /**
     * Ensures that focus it put on input field when component is shown
     */
    // TODO No jquery
    // didMount() {
    //     setTimeout(function () {
    //         // Workaround: Need to wait because of initial rerender process
    //         $('#formSearch').focus()
    //     }, 50)
    // }

    didMount() {
        this.context.editorSession.onRender('document', this._onDocumentChange, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    _onDocumentChange(change) {
        if (change.isAffected(this.props.node.id) || change.isAffected(this.props.node.imageFile)) {
            this.rerender()
        }
    }

    render($$) {
        const el = $$('div')
            .ref('authorContainer')
            .addClass('authors dialog-image-info clearfix')

        const bylinesearch = this.context.api.getConfigValue(
            'se.infomaker.ximimage', 'bylinesearch')

        let searchComponent

        if (bylinesearch) {
            const AuthorSearchComponent = this.context.componentRegistry.get('form-search')
            searchComponent = $$(AuthorSearchComponent, {
                existingItems: this.props.node.authors,
                searchUrl: '/api/search/concepts/authors?q=',
                onSelect: this.addAuthor.bind(this),
                onCreate: this.createAuthor.bind(this),
                createAllowed: true,
                placeholderText: this.getLabel("Add to byline")
            }).ref('authorSearchComponent')
        } else {
            const AuthorAddComponent = this.context.componentRegistry.get('form-add')

            searchComponent = $$(AuthorAddComponent, {
                existingItems: this.props.node.authors,
                onSelect: this.addAuthor.bind(this),
                onCreate: this.createAuthor.bind(this),
                createAllowed: true,
                placeholderText: this.getLabel("Add to byline")
            }).ref('authorSearchComponent')
        }

        return el.append([
            searchComponent,
            this.renderAuthors($$)
        ])

    }

    renderAuthors($$) {
        const authorList = $$('ul')
            .addClass('dialog-image-authorlist')
            .attr('contenteditable', false)

        for (let n = 0; n < this.props.node.authors.length; n++) {
            const authorItem = this.renderAuthor($$, this.props.node.authors[n])
            if (authorItem) {
                authorList.append(authorItem)
            }
        }

        return $$('div')
            .addClass('dialog-image-authors')
            .append(
            authorList
            )
    }

    renderAuthor($$, author) {
        const Avatar = api.ui.getComponent('avatar')

        let twitterHandle
        if(author.isLoaded && author.links && author.links.link) {
            const twitterLink = Avatar._getLinkForType(author.links.link, 'x-im/social+twitter')
            const twitterURL = Avatar._getTwitterUrlFromAuhtorLink(twitterLink)
            twitterHandle = Avatar._getTwitterHandleFromTwitterUrl(twitterURL)
        }
        const avatarEl = $$(Avatar, {avatarSource: 'twitter', avatarId: twitterHandle})

        const refid = (NilUUID.isNilUUID(author.uuid)) ? author.name : author.uuid
        return $$('li').append(
            $$('div').append([
                avatarEl,
                $$('div').append([
                    $$('strong').append(author.name),
                    $$('em').append(author.data ? author.data.email ? author.data.email : '' : '')
                ]),
                $$('span').append(
                    $$('a').append(
                        $$(FontAwesomeIcon, { icon: 'remove' })
                    )
                        .attr('title', this.getLabel('Remove'))
                        .on('click', function () {
                            this.removeAuthor(author)
                        }.bind(this))
                )
            ])
        ).ref('item-' + refid)
    }

    createAuthor(authorItem) {

        const author = new Author(NilUUID.getNilUUID(), authorItem.inputValue, this.props.node.id)
        this.props.addAuthor(author, () => {
            this.rerender()
        })
    }

    addAuthor(authorItem) {

        const author = new Author(authorItem.uuid, authorItem.name[0], this.props.node.id)

        this.props.addAuthor(author, function () {
            this.rerender()
        }.bind(this))
    }

    removeAuthor(author) {
        const refid = (NilUUID.isNilUUID(author.uuid)) ? author.name : author.uuid
        delete this.refs['item-' + refid]

        this.props.removeAuthor(author)
    }

    onClose() {
        return true
    }

}

export default XimimageAddToBylineComponent