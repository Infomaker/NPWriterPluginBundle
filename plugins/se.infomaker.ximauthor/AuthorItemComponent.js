import {FontAwesomeIcon} from 'substance'
import {jxon, api} from 'writer'
import AuthorBaseComponent from './AuthorBaseComponent'
import AuthorInfoComponent from './AuthorInfoComponent'
import AuthorEditComponent from './AuthorEditComponent'

class AuthorItemComponent extends AuthorBaseComponent {

    constructor(...args) {
        super(...args)

        this.handleActions({
            'avatarLoaded': this.avatarLoaded
        })
    }

    didMount() {
        if (this.props.uuid) {
            this._loadAuthor()
        } else {
            console.error('Error rendering author. Missing uuid')
        }
    }

    getInitialState() {
        return {
            author: null
        }
    }

    render($$) {
        if (!this.state.author) {
            return $$('div')
        }

        const fullName = this._getFullName()
        const email = this._getDataElement('email')
        const links = this._getItemMetaLinks()

        const el = $$('li')
            .addClass('authors__list-item')
            .addClass('clearfix')
            .ref('authorItem')

        const deleteButton = $$('button')
            .addClass('author__button--delete')
            .append($$(FontAwesomeIcon, {icon: 'fa-times'}))
            .attr('title', this.getLabel('Remove from article'))
            .on('click', function () {
                this.removeAuthor(fullName)
            }.bind(this))

        const displayNameEl = $$('span')
            .append(fullName)
            .attr('data-toggle', 'tooltip')
            .attr('data-placement', 'bottom')
            .attr('data-trigger', 'manual')

        const metaDataContainer = $$('div')
            .addClass('metadata__container')
            .append($$('span')
                .append(displayNameEl)
                .addClass('author__name meta')
                .on('click', this.showInformation))

        if (email) {
            metaDataContainer
                .append($$('span')
                    .append(email).addClass('author__email meta'))
        }

        const Avatar = api.ui.getComponent('avatar')

        let avatarEl
        if (links.length > 0) {
            const twitterLink = Avatar._getLinkForType(links, 'x-im/social+twitter')
            const twitterURL = Avatar._getTwitterUrlFromAuhtorLink(twitterLink)

            if (twitterURL) {
                const twitterHandle = Avatar._getTwitterHandleFromTwitterUrl(twitterURL)
                avatarEl = $$(Avatar, {avatarSource: 'twitter', avatarId: twitterHandle})
            }
        }

        if (!avatarEl) {
            avatarEl = $$(Avatar, {})
        }

        const avatarContainer = $$('div').addClass('avatar__container').ref('avatarContainer')
        avatarContainer.append(avatarEl)

        el.append(avatarContainer)
            .append(metaDataContainer)
            .append($$('div')
                .addClass('button__container')
                .append(deleteButton))

        el.on('mouseenter', this.showHover)
        el.on('mouseleave', this.hideHover)

        return el;
    }

    _loadAuthor() {
        return this.context.api.router.getConceptItem(this.props.uuid, 'x-im/author')
            .then((authorDocument) => {
                const author = jxon.build(authorDocument.querySelector('conceptItem'))

                this.setState({
                    author: author
                });

                this._updateAuthor()
            })
            .catch((error) => {
                console.error('Failed to load author with id', this.props.uuid, 'Error was:', error)
            })
    }

    _updateAuthor() {
        const email = this._getDataElement('email')
        const author = {
            name: this._getFullName()
        }

        if (email) {
            author['email'] = email
        }

        this.context.api.newsItem.updateAuthorWithUUID('ximauthor', this.props.uuid, author)
    }

    /**
     * Remove author. Author object needs to be constructed since source
     * function handles both author concept and simple authors.
     *
     * @param name The full author name.
     */
    removeAuthor(name) {
        const author = {
            uuid: this.props.uuid,
            title: name
        }
        this.props.removeAuthor(author)
    }

    /**
     * When avatar is done loading, set the src to the loaded author
     */
    avatarLoaded() {
        /* Needed? */
    }

    /**
     * Show information about the author in AuthorInfoComponent rendered in a dialog
     */
    showInformation() {
        const name = this._getFullName()
        const handleConceptAuthors = this.context.api.getConfigValue('se.infomaker.ximauthor', 'handleConceptAuthors')

        if (!handleConceptAuthors) {
            this.context.api.ui.showDialog(AuthorInfoComponent,
                {
                    author: this.state.author
                },
                {
                    secondary: false,
                    title: name,
                    global: true
                }
            )
        } else {
            this.context.api.ui.showDialog(AuthorEditComponent,
                {
                    author: this.state.author,
                    close: this.closeFromDialog.bind(this),
                    couldNotLoad: this.state.couldNotLoad
                },
                {
                    primary: this.getLabel('Save'),
                    title: this.getLabel('ximauthors-edit') + ' ' + name,
                    global: true
                }
            )
        }
    }

    closeFromDialog() {
        this._loadAuthor() // Reload new changes
    }

    showHover() {
        const delButton = this.el.find('.author__button--delete')
        delButton.addClass('active')
    }

    hideHover() {
        const delButton = this.el.find('.author__button--delete')
        delButton.removeClass('active')
    }
}

export default AuthorItemComponent
