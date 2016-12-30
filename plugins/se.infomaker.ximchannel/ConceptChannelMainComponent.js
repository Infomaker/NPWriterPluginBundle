import {Component} from 'substance'
import ChannelItemComponent from './ChannelItemComponent'
import {api} from 'writer'

class ConceptMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'concept-channel'
    }

    reload() {
        this.setState({
            existingChannel: api.newsItem.getLinkByTypeAndRel(this.name, 'x-im/channel', 'channel')
        })
    }

    getInitialState() {
        return {
            existingChannel: api.newsItem.getLinkByTypeAndRel(this.name, 'x-im/channel', 'channel')
        }
    }

    render($$) {
        var el = $$('ul')
            .ref('conceptChannelList')
            .addClass('concept-channel tag-list')
            .append(
                $$('h2').append(
                    this.getLabel('Main channel')
                )
            )

        if(this.state.existingChannel[0]) {
            el.append(
                $$(ChannelItemComponent, {
                    channel: this.state.existingChannel[0], // Just get the first item, channels are supposed to be just one
                    removeChannel: this.removeChannel.bind(this)
                }).ref('channelItem')
            )
        }
        else {
            const SearchComponent = this.context.componentRegistry.get('form-search')
            el.append(
                $$(SearchComponent, {
                    existingItems: this.state.existingTags,
                    searchUrl: '/api/search/concepts/channels?q=',
                    onSelect: this.addChannel.bind(this),
                    placeholderText: "Search channels"
                }).ref('searchComponent')
            )
        }

        return el
    }

    addChannel(item) {
        api.newsItem.addLink(this.name, {
            '@rel': 'channel',
            '@title': item.name[0],
            '@type': item.imType[0],
            '@uuid': item.uuid
        })

        this.reload()
    }

    removeChannel(channel) {
        api.newsItem.removeLinkByUUIDAndRel(this.name, channel['@uuid'], 'channel')
        this.reload()
    }
}

export default ConceptMainComponent
