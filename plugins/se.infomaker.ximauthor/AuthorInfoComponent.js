import {FontAwesomeIcon} from 'substance'
import AuthorBaseComponent from './AuthorBaseComponent'


class AuthorInfoComponent extends AuthorBaseComponent {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        return {
            author: this.props.author
        }
    }

    render($$) {
        const el = $$('div').addClass('author__info')
        const description = this._getDefinition('drol:long')

        const email = this._getDataElement('email')
        const phone = this._getDataElement('phone')

        if (description) {
            const descriptionEl = $$('p').append(description)
            el.append(descriptionEl);
        }

        if (email) {
            const emailEl = $$('a')
                .append($$(FontAwesomeIcon, {icon: 'fa-envelope-o'})).attr('href', 'mailto:' + email)
                .append(email)

            el.append(emailEl)
        }

        if (phone) {
            let phoneEl = $$('a')
                .append($$(FontAwesomeIcon, {icon: 'fa-phone'})).attr('href', 'tel:' + phone)
                .append(phone)

            el.append(phoneEl)
        }

        return el
    }

    onClose() {
    }
}

export default AuthorInfoComponent
