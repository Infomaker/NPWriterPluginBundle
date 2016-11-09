'use strict';

var Component = require('substance/ui/Component');
var $$ = Component.$$;
var Icon = require('substance/ui/FontAwesomeIcon');
var jxon = require('jxon/index');

function LocationItemComponent() {
    LocationItemComponent.super.apply(this, arguments);
    this.name = 'location';
}

LocationItemComponent.Prototype = function () {

    this.loadLocation = function () {
        this.ajaxRequest = this.context.api.router.ajax('GET', 'xml', '/api/newsitem/' + this.props.location.uuid, {imType: this.props.location.type});
        this.ajaxRequest
            .done(function (data) {
                var conceptXML = data.querySelector('conceptItem');
                this.setState({
                    loadedLocation: jxon.build(conceptXML),
                    isLoaded: true
                });
            }.bind(this))
            .error(function () {
                this.setState({
                    isLoaded: true,
                    couldNotLoad: true
                });
            }.bind(this));
    };


    this.render = function () {

        var location = this.props.location;

        var locItem = $$('li').addClass('tag-list__item');
        var displayNameEl = $$('span');

        var locationType = 'position';

        if (!this.state.isLoaded) {
            displayNameEl.addClass('tag-item__title tag-item__title--loading').append(location.title);
            this.loadLocation();

        } else {
            if (this.state.couldNotLoad) {
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar tag-item__title--notexisting')
                    .append(location.title)
                    .attr('title', this.context.i18n.t('This item could not be loaded. UUID: ')+location.uuid);
            } else {
                locationType = this.state.loadedLocation.concept.metadata.object['@type'];
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar').append(this.state.loadedLocation.concept.name);

                displayNameEl.attr('title', location.title);

                this.updateTagItemName(displayNameEl, this.state.loadedLocation);

                displayNameEl.attr('data-toggle', 'tooltip')
                    .attr('data-placement', 'bottom')
                    .attr('data-trigger', 'manual');


                // TODO: Find a way to update the NewsItem when a concept name has changed
                // Check if there's been an update
                if (this.state.loadedLocation.concept.name !== location.title) {
                    this.setState({
                        isLoaded: false
                    });
                }

                displayNameEl.on('click', function () {
                    this.props.openMap(this.state.loadedLocation);
                }.bind(this));

                displayNameEl.on('mouseenter', this.toggleTooltip);
                displayNameEl.on('mouseout', this.hideTooltip);

            }

            locItem.append(displayNameEl);

            var deleteButton = $$('span').append($$(Icon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.context.i18n.t('Remove from article')))
                .on('click', function () {
                    this.removeTag(location);
                }.bind(this));
            locItem.append(deleteButton);

            var icon = 'fa-map-marker';
            if (locationType === 'x-im/polygon') {
                icon = 'fa-map';
            }
            locItem.append($$(Icon, {icon: icon}).addClass('tag-icon'));
        }


        return locItem;
    };

    this.removeTag = function (location) {
        this.$el.first().fadeOut(200, function () {
            this.props.removeLocation(location);
        }.bind(this));

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
        if (loadedTag.concept && loadedTag.concept.definition) {
            var definition = _.isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition];
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

};

Component.extend(LocationItemComponent);
module.exports = LocationItemComponent;
