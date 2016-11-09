/*'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var jxon = require('jxon/index');
var Avatar = require('writer/components/avatar/AvatarComponent');
var NilUUID = require('writer/utils/NilUUID');
var findAttribute = require('vendor/infomaker.se/utils/FindAttribute');



function AuthorItemComponent() {
    AuthorItemComponent.super.apply(this, arguments);

    this.handleActions({
        'avatarLoaded': this.avatarLoaded
    });
}

AuthorItemComponent.Prototype = function () {

    this.getInitialState = function () {
        return {
            name: undefined,
            isLoaded: false,
            isSimpleAuthor: false,
            loadedAuthor: {}
        };
    };

    this.dispose = function () {
        if (this.ajaxRequest) {
            this.ajaxRequest.abort();
        }
        Component.prototype.dispose.call(this);
    };

    this.loadAuthor = function () {
        // If no UUID is provided, assume it's a simple author
        if (NilUUID.isNilUUID(this.props.author.uuid) && this.props.author.title) {

            // Hack: Set a timeout to fix some render issues
            setTimeout(function () {
                this.setState({
                    name: this.props.author.title,
                    isLoaded: true,
                    isSimpleAuthor: true,
                    loadedAuthor: {name: this.props.author.title}
                });
            }.bind(this), 1);
        } else {
            this.ajaxRequest = this.context.api.router.ajax('GET', 'xml', '/api/newsitem/' + this.props.author.uuid, {imType: this.props.author.type});
            this.ajaxRequest
                .done(function (data) {
                    var conceptXML = data.querySelector('concept');
                    var linksXML = data.querySelector('itemMeta links');
                    var jsonFormat = jxon.build(conceptXML);

                    var authorLinks;
                    if(linksXML) {
                        authorLinks = jxon.build(linksXML);
                    }

                    this.setState({
                        name: jsonFormat.name,
                        isLoaded: true,
                        isSimpleAuthor: false,
                        loadedAuthor: jsonFormat,
                        loadedAuhtorLinks: authorLinks
                    });

                }.bind(this))
                .error(function () {
                    this.setState({
                        name: this.props.author.title,
                        isLoaded: true,
                        isSimpleAuthor: true,
                        loadedAuthor: {name: this.props.author.title}
                    });
                }.bind(this));
        }
    };

    this.render = function () {

        var author = this.props.author,
            authorItem = $$('li').addClass('authors__list-item').addClass('clearfix').ref('authorItem'),
            displayTitle = this.state.name ? this.state.name : author.title;

        var deleteButton = $$('button').addClass('author__button--delete')
            .append($$(Icon, {icon: 'fa-times'}))
            .attr('title', this.context.i18n.t('Remove from article'))
            .on('click', function () {
                this.removeAuthor(author);
            }.bind(this));

        if (!this.state.isLoaded) {
            this.loadAuthor();
        } else if (this.state.isSimpleAuthor) {
            this.populateElementsForSimpleAuthor(authorItem, displayTitle, deleteButton);
        } else {
            this.populateElementForAuthor(authorItem, author, displayTitle, deleteButton);
        }
        authorItem.on('mouseenter', this.showHover);
        authorItem.on('mouseleave', this.hideHover);
        return authorItem;
    };

    this.populateElementsForSimpleAuthor = function (authorItem, displayTitle, deleteButton) {
        authorItem.append($$('div').addClass('avatar__container')
            .append($$('img').attr('src', this.context.api.router.getEndpoint() + '/asset/dummy.svg').addClass('avatar')))
            .append($$('div').addClass('metadata__container')
                .append($$('span').append(displayTitle).addClass('author__name notClickable meta')).attr('title', this.context.i18n.t('Not editable author')))
            .append($$('div').addClass('button__container')
                .append(deleteButton));


    };

    this.populateElementForAuthor = function (authorItem, author, displayTitle, deleteButton) {

        var displayNameEl = $$('span').append(displayTitle);

        displayNameEl.attr('data-toggle', 'tooltip')
            .attr('data-placement', 'bottom')
            .attr('data-trigger', 'manual');

        displayNameEl.on('mouseenter', this.toggleTooltip);
        displayNameEl.on('mouseout', this.hideTooltip);

        this.updateTagItemName(displayNameEl, this.state.loadedAuthor);

        var metaDataContainer = $$('div').addClass('metadata__container')
            .append($$('span').append(displayNameEl).addClass('author__name meta').on('click', this.showInformation));



        var email = findAttribute(this.state.loadedAuthor, 'email');
        if(email) {
            metaDataContainer.append($$('span').append(email).addClass('author__email meta'));
        }

        authorItem
            .append($$('div').addClass('avatar__container').ref('avatarContainer')
                .append($$(Avatar, {author: author, links: this.state.loadedAuhtorLinks}).ref('avatar')))
            .append(metaDataContainer)
            .append($$('div').addClass('button__container')
                .append(deleteButton));
    };

    this.toggleTooltip = function (ev) {
        $(ev.target).tooltip('toggle');
        ev.target.timeout = window.setTimeout(function () {
            this.hideTooltip(ev)
        }.bind(this), 3000)
    };

    this.hideTooltip = function (ev) {
        if (ev.target.timeout) {
            window.clearTimeout(ev.target.timeout);
            ev.target.timeout = undefined;
        }
        $(ev.target).tooltip('hide');
    };

    this.updateTagItemName = function (tagItem, loadedTag) {
        if (loadedTag && loadedTag.definition) {
            var definition = _.isArray(loadedTag.definition) ? loadedTag.definition : [loadedTag.definition];
            for (var i = 0; i < definition.length; i++) {
                var item = definition[i];
                if (item["@role"] === "drol:short") {
                    if (item["keyValue"] && item["keyValue"].length > 0) {
                        tagItem.attr('title', item["keyValue"]);
                        break;
                    }
                }
            }
        }
    };

    /**
     * Remove author
     * @param author
     */
  /*  this.removeAuthor = function (author) {
        this.$el.first().fadeOut(300, function () {
            this.props.removeAuthor(author);
        }.bind(this));

    };

    /**
     * When avatar is done loading, set the src to the loaded author
     * @param avatar
     */
   /* this.avatarLoaded = function (avatar) {
        var loadedAuthor = this.state.loadedAuthor;
        loadedAuthor.avatarSrc = avatar.url;
        if (loadedAuthor.avatarSrc !== avatar.url) {
            this.extendState({
                loadedAuthor: loadedAuthor
            });
        }
    };


    /**
     * Show information about the author in AuthorInfoComponent rendered in a dialog
     */
  /*  this.showInformation = function () {
        var authorInfo = require('./AuthorInfoComponent');
        this.context.api.showDialog(authorInfo, {
            author: this.state.loadedAuthor
        }, {
            secondary: false,
            title: this.state.loadedAuthor.name,
            global: true
        });
    };

    this.showHover = function () {
        var delButton = this.$el.find('.author__button--delete');
        delButton.addClass('active');
    };
    this.hideHover = function () {
        var delButton = this.$el.find('.author__button--delete');
        delButton.removeClass('active');
    };

};
Component.extend(AuthorItemComponent);
module.exports = AuthorItemComponent;
*/