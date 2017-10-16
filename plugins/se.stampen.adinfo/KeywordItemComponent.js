import { Component, FontAwesomeIcon as Icon } from 'substance'


class KeywordItemComponent extends Component {

    render($$) {
        const displayName = this.props.keyword

        const tagItem = $$('li')
            .addClass('tag-list__item')
            .ref('tagItem')

        const keywordNameElement = $$('span')
            .addClass('tag-item__title tag-item__title--no-avatar')
            .attr('title', this.getLabel('Category'))

        keywordNameElement
            .append(displayName)
            .attr('title', displayName)

        const removeItemElement = $$('span').append($$(Icon, {icon: 'fa-times'})
            .addClass('tag-icon tag-icon--delete')
            .attr('title', this.getLabel('Remove from article')))
            .on('click', () => {
                this.removeKeyword()
            })

        const itemIconElement = $$(Icon, {icon: 'fa-key'}).addClass('tag-icon')

        tagItem.append([keywordNameElement, removeItemElement, itemIconElement])

        return tagItem;
    }

    /**
     * Remove the components keyword from its parent's state
     */
    removeKeyword() {
        this.props.removeKeyword(this.props.keyword)
    }
}

export default KeywordItemComponent
