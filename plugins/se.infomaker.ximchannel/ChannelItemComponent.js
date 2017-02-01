import {Component, FontAwesomeIcon as Icon} from 'substance'
import {api, jxon, lodash as _} from 'writer'
import ConceptChannelInfoComponent from './ConceptChannelInfoComponent'

class ChannelItemComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'concept-channel'
    }

    getInitialState() {
        return {
            isLoaded: false,
            loadedItem: {}
        }
    }

    loadChannel(item) {
        api.router.getConceptItem(
            item['@uuid'],
            item['@type']
        )
        .then(xml => {
            const conceptXML = xml.querySelector('conceptItem'),
                conceptItemJSON = jxon.build(conceptXML)

            this.extendState({
                loadedItem: conceptItemJSON,
                isLoaded: true
            })
        })
        .catch(() => {
            this.extendState({
                isLoaded: true,
                couldNotLoad: true
            })
        })
    }

    render($$) {
        var channel = this.props.channel
        if (!channel) {
            return $$('div');
        }

        let displayLabel = this.state.isLoaded ? this.state.loadedItem.concept.name : channel['@title']

        var channelItem = $$('li')
                .addClass('tag-list__item tag-item__title--no-avatar').addClass('clearfix')
                .ref('channelItem'),
            displayTitle = $$('span').append(
                displayLabel
            )

        if (this.state.isLoaded) {
            displayLabel = this.getShortDescription(this.state.loadedItem)
        }

        const Tooltip = api.ui.getComponent('tooltip')

        displayTitle.append($$(Tooltip, {title: displayLabel, parent: this}).ref('tooltip'))
        displayTitle.on('mouseover', () => {
            this.refs.tooltip.extendProps({
                show: true
            })
        })
        displayTitle.on('mouseout', () => {
            this.refs.tooltip.extendProps({
                show: false
            })
        })

        var deleteButton = $$('span').append($$(Icon, {icon: 'fa-times'})
            .addClass('tag-icon tag-icon--delete')
            .attr('title', this.getLabel('Remove from article')))
            .on('click', () => {
                this.props.removeChannel(channel)
            })

        if (!this.state.isLoaded) {
            this.loadChannel(this.props.channel)
        }
        else {
            channelItem
                .append($$('span')
                    .addClass('concept-channel__name tag-item__title tag-item__title--no-avatar ')
                    .append(
                        displayTitle
                    ).on('click', this.showInformation))
                .append(deleteButton)
                .append($$(Icon, {icon: 'fa-random'}).addClass('tag-icon'))
        }




        return channelItem
    }

    getShortDescription(loadedTag) {

        let definition = _.isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition]
        for (var i = 0; i < definition.length; i++) {
            let item = definition[i]

            if (item["@role"] !== "drol:short") {
                continue
            }

            if (item["keyValue"] && item["keyValue"].length > 0) {
                // tagItem.attr('title', item["keyValue"]);
                return item["keyValue"]
            }
        }
    }

    /**
     * Show information about the author in AuthorInfoComponent rendered in a dialog
     */
    showInformation() {
        api.ui.showDialog(
            ConceptChannelInfoComponent,
            {
                channel: this.state.loadedItem
            },
            {
                secondary: false,
                title: this.state.loadedItem.concept.name,
                global: true
            }
        )
    }
}

export default ChannelItemComponent
