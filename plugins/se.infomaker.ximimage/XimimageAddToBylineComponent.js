import {Component, FontAwesomeIcon} from "substance";
import {NilUUID} from "writer";

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
                existingItems: this.props.authors,
                searchUrl: '/api/search/concepts/authors?q=',
                onSelect: this.addAuthor.bind(this),
                onCreate: this.createAuthor.bind(this),
                createAllowed: true,
                placeholderText: this.getLabel("Add to byline")
            }).ref('authorSearchComponent')
        } else {
            const AuthorAddComponent = this.context.componentRegistry.get('form-add')

            searchComponent = $$(AuthorAddComponent, {
                existingItems: this.props.authors,
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

        for (let n = 0; n < this.props.authors.length; n++) {
            const authorItem = this.renderAuthor($$, this.props.authors[n])
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
        let avatar
        // TODO Implement Avatar
        // if (!NilUUID.isNilUUID(author.uuid)) {
        //     avatar = $$('div')
        //         .addClass('avatar__container')
        //         .ref('avatarContainer')
        //         .append(
        //             $$(Avatar, {
        //                 links: author.links
        //             }).ref('avatar')
        //         )
        // }
        // else {
        avatar = $$('span')
        // }

        const refid = (NilUUID.isNilUUID(author.uuid)) ? author.name : author.uuid
        return $$('li').append(
            $$('div').append([
                avatar,
                $$('div').append([
                    $$('strong').append(author.name),
                    $$('em').append(author.data ? author.data.email ? author.data.email : '' : '')
                ]),
                $$('span').append(
                    $$('a').append(
                        $$(FontAwesomeIcon, {icon: 'remove'})
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
        const author = {
            uuid: NilUUID.getNilUUID(),
            name: authorItem.inputValue
            //name: authorItem.name[0]
        }

        this.props.addAuthor(author, function () {
            this.rerender()
        }.bind(this))
    }

    addAuthor(authorItem) {
        const author = {
            uuid: authorItem.uuid,
            name: authorItem.name[0]
        }

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