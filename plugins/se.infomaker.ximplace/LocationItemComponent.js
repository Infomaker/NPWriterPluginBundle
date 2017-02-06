'use strict';

import {Component} from 'substance'
// var $$ = Component.$$;
import {FontAwesomeIcon} from 'substance'
import {jxon, api} from 'writer'
import {isArray} from 'lodash'


class LocationItemComponent extends Component {
    constructor(...args) {
        super(...args)
        this.name = 'ximplace'
    }

    loadLocation() {
        const api = this.context.api;
        api.router.getConceptItem(this.props.location.uuid, this.props.location.type)
            .then(xml => {
                const conceptXML = xml.querySelector('conceptItem')
                try {
                    this.setState({
                        loadedLocation: jxon.build(conceptXML),
                        isLoaded: true
                    });
                } catch (e) {
                    this.setState({
                        isLoaded: true,
                        couldNotLoad: true
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isLoaded: true,
                    couldNotLoad: true
                });
            })
    }

    render($$) {

        const location = this.props.location

        const locItem = $$('li').addClass('tag-list__item')
        const displayNameEl = $$('span')

        let locationType = 'position'

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

                const label = LocationItemComponent.getShortDescription(this.state.loadedLocation)
                const title = label ? label : location.title

                // TODO: Find a way to update the NewsItem when a concept name has changed
                // Check if there's been an update
                if (this.state.loadedLocation.concept.name !== location.title) {
                    this.setState({
                        isLoaded: false
                    });
                }

                const Tooltip = api.ui.getComponent('tooltip')
                displayNameEl.on('click', function () {
                    this.props.openMap(this.state.loadedLocation)
                }.bind(this))
                    .append($$(Tooltip, {title: title, parent: this}).ref('tooltip'))

                displayNameEl.on('mouseenter', this.toggleTooltip)
                displayNameEl.on('mouseout', this.hideTooltip)

            }

            locItem.append(displayNameEl)

            const deleteButton = $$('span').append($$(FontAwesomeIcon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.getLabel('Remove from article')))
                .on('click', function () {
                    this.removeTag(location)
                }.bind(this))
            locItem.append(deleteButton)

            let icon = 'fa-map-marker'
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

    toggleTooltip(ev) {
        this.refs.tooltip.extendProps({
            show: true
        })
    }

    hideTooltip(ev) {
        this.refs.tooltip.extendProps({
            show: false
        })
    }


    static getShortDescription(loadedTag) {
        if (loadedTag.concept && loadedTag.concept.definition) {
            const definition = isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition]
            for (let i = 0; i < definition.length; i++) {
                const item = definition[i]
                if (item["@role"] === "drol:short") {
                    if (item["keyValue"] && item["keyValue"].length > 0) {
                        return item["keyValue"]
                    }
                }
            }
        }
    }


}

export default LocationItemComponent

