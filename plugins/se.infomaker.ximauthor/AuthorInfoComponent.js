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

    this.dispose = function () {
        Component.prototype.dispose.call(this);
    };


    this.render = function () {
        var el = $$('div').addClass('author__info');

        var avatarSrc = replace(this.props.author.avatarSrc, '_normal', '');

        var avatar = $$('img').attr('src', avatarSrc);
        el.append(avatar);

        var description = find(this.props.author.definition, function (def) {
            return def['@role'] === 'drol:long';
        });

        if(description) {
            var descriptionEl = $$('p').append(description['keyValue']);
            el.append(descriptionEl);
        }

        var email = findAttribute(this.props.author, 'email');
        if(email) {
            var emailEl = $$('a').append($$(Icon, {icon: 'fa-envelope-o'})).attr('href','mailto:'+email).append(email);
            el.append(emailEl);
        }
        var phone = findAttribute(this.props.author, 'phone');
        if(phone) {
            var phoneEl = $$('a').append($$(Icon, {icon: 'fa-phone'})).attr('href','tel:'+phone).append(phone);
            el.append(phoneEl);
        }


        return el;
    };

    this.onClose = function (status) {

    };

};
Component.extend(AuthorInfoComponent);
module.exports = AuthorInfoComponent;
*/