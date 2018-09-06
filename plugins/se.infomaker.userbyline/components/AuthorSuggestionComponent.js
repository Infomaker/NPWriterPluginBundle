import {Component} from 'substance'
import {ConceptService} from 'writer'

class AuthorSuggestionComponent extends Component {

    render($$) {
        const { suggestion, propertyMap } = this.props

        return $$('li', { class: 'user-author-suggestions-list-item' }, [
            $$('div', { class: 'user-list-avatar-wrapper' }, [
                suggestion.ConceptAvatarUuid ?
                    $$('img', {
                        class: 'user-list-avatar',
                        src: `${ConceptService.getRemoteObjectsPath()}/${suggestion.ConceptAvatarUuid}/files/thumb`,
                    }) :
                    $$('i', { class: 'fa fa-user-o user-list-avatar' })
            ]),
            $$('div', { class: 'user-list-info-wrapper' }, [
                $$('p', { class: 'user-list-item-name' }, `${suggestion[propertyMap.ConceptName]}`),
                $$('p', { class: 'user-list-item-short' }, `${suggestion[propertyMap.ConceptDefinitionShort]}`)
            ])
        ]).on('click', () => this.props.addAuthor(suggestion))
    }
}

export {AuthorSuggestionComponent}
