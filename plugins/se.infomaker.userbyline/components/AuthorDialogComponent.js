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
        this.props.addAuthor(author)
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
                'Vi hittade inga författare som matchade inloggad användare.' :
                renderedSuggestions.length === 1 ?
                    'Är detta du?' :
                    'Är någon av dessa författare du?'
        )

        return $$('div', { class: 'user-author-suggestions-wrapper' }, [
            suggestions.length ? $$('ul', { class: 'user-author-suggestions-list' },
                suggestionInformation,
                ...renderedSuggestions
            ) : '',
            $$('div', { class: 'user-author-suggestion-links-wrapper' }, [
                $$('a', { class: 'create-new-author-link' }, 'Skapa ny')
            ])
        ]).on('keydown', this.overrideEscapeButton)
    }

    onClose() {
        return true
    }

}

export {AuthorDialogComponent}
