import {Component} from 'substance'
import {AuthorSuggestionComponent} from './AuthorSuggestionComponent'

class AuthorDialogComponent extends Component {

    constructor(...args) {
        super(...args)

        this.addAuthor = this.addAuthor.bind(this)
        this.overrideEscapeButton = this.overrideEscapeButton.bind(this)
        document.addEventListener('keydown', this.overrideEscapeButton, true)
    }

    dispose() {
        document.removeEventListener('keydown', this.overrideEscapeButton, true)
    }

    overrideEscapeButton(e) {
        const { keyCode, key } = e
        if (keyCode === 27 || key === 'Escape') { // Escape
            e.stopPropagation()
            e.preventDefault()
            return false
        }
    }

    addAuthor(author) {
        this.send('dialog:close')
        this.props.addImidUserToArticleByline(author)
    }

    render($$) {
        const { suggestions } = this.props
        const renderedSuggestions = suggestions.map(suggestion => $$(AuthorSuggestionComponent, {
            ...this.props,
            addAuthor: this.addAuthor,
            suggestion
        }))
        const suggestionInformation = $$('h4', { class: 'user-author-suggestion-info' },
            !renderedSuggestions.length ?
                this.getLabel('No author concepts matching logged in user was found. Please contact your support department.') :
                renderedSuggestions.length === 1 ?
                    this.getLabel('Is this you?') :
                    this.getLabel('Are you one of these authors?')
        )
        const authorSubInfo = $$('p', { class: 'user-author-sub-info' },
            renderedSuggestions.length ?
                this.getLabel('Selected author will be associated with current user account. You only have to do this once.') :
                ''
        )
        const supportInfo = $$('p', { class: 'user-support-info' },
            renderedSuggestions.length ?
                this.getLabel('If you cant find an author please contact your support department.') :
                ''
        )
        const suggestionWrapper = $$('div', { class: 'user-author-suggestions-list-wrapper' },
            renderedSuggestions.length ? $$('ul', { class: 'user-author-suggestions-list' },
                ...renderedSuggestions
            ) : '',
        )

        return $$('div', { class: 'user-author-suggestions-wrapper' }, [
            suggestionInformation,
            authorSubInfo,
            supportInfo,
            suggestionWrapper
        ]).on('keydown', this.overrideEscapeButton)
    }

    onClose() {
        return true
    }

}

export {AuthorDialogComponent}
