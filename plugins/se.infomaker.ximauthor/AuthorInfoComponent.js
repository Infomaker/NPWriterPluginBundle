import {Component, FontAwesomeIcon} from 'substance'
import {replace, isObject} from 'lodash'

class AuthorInfoComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    didMount() {

    }

    dispose() {
        Component.prototype.dispose.call(this)
        // TODO: what to use
        //this.context.editorSession.off(this)
    }

    render($$) {
        var el = $$('div').addClass('author__info')
        var avatarSrc = replace(this.props.author.avatarSrc, '_normal', '')
        var avatar = $$('img').attr('src', avatarSrc)

        el.append(avatar)

        var description = find(this.props.author.definition, function (def) {
            return def['@role'] === 'drol:long'
        });

        if (description) {
            var descriptionEl = $$('p').append(description['keyValue']);
            el.append(descriptionEl);
        }

        var email = this.findAttribute(this.props.author, 'email')

        if (email) {
            var emailEl = $$('a')
                .append($$(FontAwesomeIcon, {icon: 'fa-envelope-o'}))
                .attr('href', 'mailto:' + email)
                .append(email)

            el.append(emailEl)
        }
        var phone = this.findAttribute(this.props.author, 'phone');
        if (phone) {
            var phoneEl = $$('a')
                .append($$(FontAwesomeIcon, {icon: 'fa-phone'}))
                .attr('href', 'tel:' + phone)
                .append(phone)

            el.append(phoneEl)
        }

        return el
    }

    findAttribute(object, attribute) {
        var match;

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

    }
}

export default AuthorInfoComponent

/*'use strict';

 var Component = require('substance/ui/Component');
 var $$ = Component.$$;
 var Icon = require('substance/ui/FontAwesomeIcon');
 var jxon = require('jxon/index');
 var replace = require('lodash/replace');
 var find = require('lodash/find');
 var isObject = require('lodash/isObject');

 var findAttribute = require('vendor/infomaker.se/utils/FindAttribute');

 function AuthorInfoComponent() {
 AuthorInfoComponent.super.apply(this, arguments);
 }

 AuthorInfoComponent.Prototype = function () {








 };
 Component.extend(AuthorInfoComponent);
 module.exports = AuthorInfoComponent;
 */