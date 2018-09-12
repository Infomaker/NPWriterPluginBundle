import {Component} from 'substance'
import {ConceptService} from 'writer'

class AuthorSuggestionComponent extends Component {

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
                    $$('i', { class: 'fa fa-user-o user-list-avatar' })
            ]),
            $$('div', { class: 'user-list-info-wrapper' }, [
                $$('p', { class: 'user-list-item-name' },
                    `${suggestion[propertyMap.ConceptName]}${existingSub ? ` (${this.getLabel('Already associated with another user')})` : ''}`),
                $$('p', { class: 'user-list-item-short' }, `${suggestion[propertyMap.ConceptDefinitionShort]}`)
            ])
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
