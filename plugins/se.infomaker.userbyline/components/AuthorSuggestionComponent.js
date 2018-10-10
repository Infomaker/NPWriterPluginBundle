import {Component} from 'substance'
import {ConceptService} from 'writer'

class AuthorSuggestionComponent extends Component {

    getTruncatedDescription(description, maxLength = 120) {
        return description.length > maxLength ?
            `${description.substring(0, maxLength).trim()}...` :
            description
    }

    render($$) {
        const { suggestion, propertyMap } = this.props
        const existingSub = suggestion[propertyMap.ConceptImIdSubjectId]

        return $$('li', { class: `user-author-suggestions-list-item ${existingSub ? 'existing-sub' : '' }` }, [
            $$('div', { class: 'user-list-avatar-wrapper' }, [
                suggestion.ConceptAvatarUuid ?
                    $$('img', {
                        class: 'user-list-avatar',
                        src: `${ConceptService.getRemoteObjectsPath()}/${suggestion.ConceptAvatarUuid}/files/thumb`,
                    }) :
                    $$('i', { class: 'fa fa-user user-list-avatar' })
            ]),
            $$('div', { class: 'user-list-info-wrapper' }, [
                $$('p', { class: 'user-list-item-name' },
                    `${suggestion[propertyMap.ConceptName]}${existingSub ? ` (${this.getLabel('Already associated with another user')})` : ''}`),
                $$('p', { class: 'user-list-item-short' }, `${this.getTruncatedDescription(suggestion[propertyMap.ConceptDefinitionShort])}`)
            ]),
            !existingSub ? $$('div', { class: 'user-list-select-wrapper' }, this.getLabel('Select')) : ''
        ]).on('click', () => {
            if (!existingSub) {
                this.props.addAuthor(suggestion)
            } else {
                return false
            }
        })
    }
}

export {AuthorSuggestionComponent}
