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
        console.info('suggestions', suggestions)
        const renderedSuggestions = suggestions.map(suggestion => $$(AuthorSuggestionComponent, {
            ...this.props,
            addAuthor: this.addAuthor,
            suggestion
        }))
        const suggestionInformation = $$('h4', { class: 'user-author-suggestion-info' },
            !renderedSuggestions.length ?
                'Vi hittade inga författare som matchade inloggad användare. Vänligen kontaka din administrativa avdelning.' :
                renderedSuggestions.length === 1 ?
                    'Är detta du?' :
                    'Är du någon av dessa författare?'
        )
        const authorSubInfo = $$('p', { class: 'user-author-sub-info' },
            renderedSuggestions.length ?
                'Vald författare kommer att kopplas till din inloggade användare. Detta val behöver du därför enbart göra en gång.' :
                ''
        )


        return $$('div', { class: 'user-author-suggestions-wrapper' }, [
            suggestionInformation,
            authorSubInfo,
            $$('div', { class: 'user-author-suggestions-list-wrapper'},
                suggestions.length ? $$('ul', { class: 'user-author-suggestions-list' },
                    ...renderedSuggestions
                ) : '',
            )
        ]).on('keydown', this.overrideEscapeButton)
    }

    onClose() {
        return true
    }

}

export {AuthorDialogComponent}
