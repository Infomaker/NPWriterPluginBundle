import {Component, FontAwesomeIcon} from 'substance'
import {isObject, find} from 'lodash'

class AuthorInfoComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    dispose() {
        // TODO: How to dispose?
        super.dispose()
    }

    render($$) {
        // TODO: add support for avatar?
        let el = $$('div').addClass('author__info')

        let description = find(this.props.author.definition, function (def) {
            return def['@role'] === 'drol:long'
        });

        if (description) {
            var descriptionEl = $$('p').append(description['keyValue'])
            el.append(descriptionEl);
        }

        let email = this.findAttribute(this.props.author, 'email')
        if (email) {
            let emailEl = $$('a')
                .append($$(FontAwesomeIcon, {icon: 'fa-envelope-o'}))
                .attr('href', 'mailto:' + email)
                .append(email)

            el.append(emailEl)
        }

        let phone = this.findAttribute(this.props.author, 'phone')
        if (phone) {
            let phoneEl = $$('a')
                .append($$(FontAwesomeIcon, {icon: 'fa-phone'}))
                .attr('href', 'tel:' + phone)
                .append(phone)

            el.append(phoneEl)
        }

        return el
    }

    // TODO: Should be refactored to util somewhere
    findAttribute(object, attribute) {
        let match;

        function iterateObject(target, name) {
            Object.keys(target).forEach(function (key) {
                if (isObject(target[key])) {
                    iterateObject(target[key], name);
                } else if (key === name) {
                    match = target[key];
                }
            })
        }

        iterateObject(object, attribute)

        return match ? match : undefined;
    }

    onClose(status) {
      // TODO: What to do?
    }
}

export default AuthorInfoComponent