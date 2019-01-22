import {Component, FontAwesomeIcon} from 'substance'
import {NilUUID, UIAvatar} from 'writer'

class SimpleAuthorItemComponent extends Component {

    render($$) {
        const el = $$('li')
            .addClass('authors__list-item')
            .addClass('clearfix')
            .ref('authorItem')

        const deleteButton = $$('button')
            .addClass('author__button--delete')
            .append($$(FontAwesomeIcon, {icon: 'fa-times'}))
            .attr('title', this.getLabel('Remove from article'))
            .on('click', function () {
                this.removeAuthor()
            }.bind(this))

        const avatarEl = $$(UIAvatar, {})

        el.append($$('div')
            .addClass('avatar__container')
            .append(avatarEl))
            .append($$('div')
                .addClass('metadata__container')
                .append($$('span')
                    .append(this.props.authorName)
                    .addClass('author__name notClickable meta'))
                .attr('title', this.getLabel('Not editable author')))
            .append($$('div')
                .addClass('button__container')
                .append(deleteButton))

        el.on('mouseenter', this.showHover)
        el.on('mouseleave', this.hideHover)

        return el;
    }

    removeAuthor() {
        const author = {
            uuid: NilUUID.getNilUUID(),
            title: this.props.authorName
        }
        this.props.removeAuthor(author)
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

export default SimpleAuthorItemComponent
