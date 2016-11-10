'use strict';

import {Component} from 'substance'
// var $$ = Component.$$;
import {FontAwesomeIcon} from 'substance'
import {jxon} from 'writer'
import {isArray} from 'lodash'


class LocationItemComponent extends Component {
    constructor(...args) {
        super(...args)
        this.name = 'ximplace'
    }

    loadLocation() {
        var api = this.context.api;
        api.router.getConceptItem(this.props.location.uuid, this.props.location.type)
            .then(xml => {
                var conceptXML = xml.querySelector('conceptItem')
                try {
                    this.setState({
                        loadedLocation: jxon.build(conceptXML),
                        isLoaded: true
                    });
                } catch (e) {
                    console.log("Error parsing location", e);
                    this.setState({
                        isLoaded: true,
                        couldNotLoad: true
                    })
                }
            })
            .catch(e => {
                this.setState({
                    isLoaded: true,
                    couldNotLoad: true
                });
            })
    }

    render($$) {

        var location = this.props.location

        var locItem = $$('li').addClass('tag-list__item')
        var displayNameEl = $$('span')

        var locationType = 'position'

        if (!this.state.isLoaded) {
            displayNameEl.addClass('tag-item__title tag-item__title--loading').append(location.title)
            this.loadLocation();

        } else {
            if (this.state.couldNotLoad) {
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar tag-item__title--notexisting')
                    .append(location.title)
                    .attr('title', this.getLabel('This item could not be loaded. UUID: ') + location.uuid)
            } else {
                locationType = this.state.loadedLocation.concept.metadata.object['@type']
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar').append(this.state.loadedLocation.concept.name)

                displayNameEl.attr('title', location.title)

                this.updateTagItemName(displayNameEl, this.state.loadedLocation)

                displayNameEl.attr('data-toggle', 'tooltip')
                    .attr('data-placement', 'bottom')
                    .attr('data-trigger', 'manual')


                // TODO: Find a way to update the NewsItem when a concept name has changed
                // Check if there's been an update
                if (this.state.loadedLocation.concept.name !== location.title) {
                    this.setState({
                        isLoaded: false
                    });
                }

                displayNameEl.on('click', function () {
                    this.props.openMap(this.state.loadedLocation)
                }.bind(this))

                // displayNameEl.on('mouseenter', this.toggleTooltip)
                // displayNameEl.on('mouseout', this.hideTooltip)

            }

            locItem.append(displayNameEl)

            var deleteButton = $$('span').append($$(FontAwesomeIcon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.getLabel('Remove from article')))
                .on('click', function () {
                    this.removeTag(location)
                }.bind(this))
            locItem.append(deleteButton)

            var icon = 'fa-map-marker'
            if (locationType === 'x-im/polygon') {
                icon = 'fa-map'
            }
            locItem.append($$(FontAwesomeIcon, {icon: icon}).addClass('tag-icon'))
        }


        return locItem;
    }


    removeTag(location) {
//        this.$el.first().fadeOut(200, function () {
        this.props.removeLocation(location)
//        }.bind(this))

    }

    // toggleTooltip(ev) {
    //     $(ev.target).tooltip('toggle')
    //     ev.target.timeout = window.setTimeout(function () {
    //         this.hideTooltip(ev)
    //     }.bind(this), 3000)
    // }
    //
    // hideTooltip(ev) {
    //     if (ev.target.timeout) {
    //         window.clearTimeout(ev.target.timeout);
    //         ev.target.timeout = undefined;
    //     }
    //     $(ev.target).tooltip('hide')
    // }


    updateTagItemName(tagItem, loadedTag) {
        if (loadedTag.concept && loadedTag.concept.definition) {
            var definition = isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition]
            for (var i = 0; i < definition.length; i++) {
                var item = definition[i]
                if (item["@role"] === "drol:short") {
                    if (item["keyValue"] && item["keyValue"].length > 0) {
                        tagItem.attr('title', item["keyValue"])
                        break
                    }
                }
            }
        }
    }


}

export default LocationItemComponent

