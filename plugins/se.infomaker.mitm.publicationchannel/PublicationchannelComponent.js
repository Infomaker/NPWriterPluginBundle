import {Component} from 'substance'
import {lodash} from 'writer'


class PublicationchannelComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    didMount() {
        this.context.api.events.on('publicationchannel', 'data:changed', (event) => {
            if (event.data && event.data.type === 'channel') {
                this.synchronize(event)
            }
        })

        this.context.api.events.on('publicationchannel', 'data:duplicated', () => {
            this.clearAllChannels()
        })
    }

    /**
     * Get initial state for publication channels
     * @returns {object}
     */
    getInitialState() {
        var activeChannelCount = 0,
            currentChannels = this.context.api.newsItem.getChannels(),
            channels = this.context.api.getConfigValue(
                'se.infomaker.mitm.publicationchannel',
                'publicationchannels'
            ),
            mainChannel = null

        channels.forEach((channel) => {
            if (currentChannels.some(currentChannel => channel.qcode === currentChannel['qcode'] && currentChannel['@why'] === 'imext:main')) {
                channel.main = true
                channel.active = true
                mainChannel = channel
                activeChannelCount++
            }
            else if (currentChannels.some(currentChannel => channel.qcode === currentChannel['qcode'])) {
                channel.active = true
                channel.main = false
                activeChannelCount++
            }
            else {
                channel.active = false
                channel.main = false
            }
        })

        return {
            mainChannel: mainChannel,
            channels: lodash.sortBy(channels, ['name']),
            activeChannelCount: activeChannelCount
        }
    }


    /**
     * Render and return a virtual dom element
     * @returns {VirtualDomElement}
     */
    render($$) {
        var el = $$('div').addClass('sc-publicationchannel'),
            checked = this.state.channels.length === this.state.activeChannelCount ? 'checked' : ''

        el.append([
            $$('h2').append(this.getLabel('publicationchannel-Channels')),
            this.renderMainChannelSelect($$),
            $$('p').addClass('sc-sharedwith').append([
                this.getLabel('publicationchannel-Shared_with'),
                $$('a').addClass(checked).append(
                    this.getLabel('publicationchannel-Choose_all')).on('click', (evt) => {
                        this.toggleAllChannels(evt.target)
                        return false
                    }
                )
            ]),

        ])

        el.append(this.renderChannelButtons($$))

        return el
    }

    /**
     * Render drop down select for main channel
     */
    renderMainChannelSelect($$) {
        var channels = [],
            mainChannel = null,
            dropdownButton = null

        this.state.channels.forEach((channel) => {
            if (channel.main === true) {
                mainChannel = channel
            }

            if (typeof channel.scope !== 'undefined' && channel.scope === 'shared') {
                return
            }

            channels.push(
                $$('button').addClass('dropdown-item').append([
                    $$('img').attr({
                        src: channel.icon
                    }),
                    channel.name
                ]).on('click', () => {
                    this.extendState({showChannelButtons: false})
                    this.toggleChannel(channel, true)
                })
            )
        })

        if (!mainChannel) {
            dropdownButton = $$('button').addClass('btn btn-secondary dropdown-toggle').attr({
                id: 'w-sharedchannels-main-select',
                type: 'button',
                'data-toggle': 'dropdown'
            }).append(
                this.getLabel('publicationchannel-Choose_main_channel')
            )
        }
        else {
            dropdownButton = $$('button').addClass('btn btn-secondary dropdown-toggle').attr({
                id: 'w-sharedchannels-main-select',
                type: 'button',
                'data-toggle': 'dropdown'
            }).append([
                $$('img').attr({
                    src: mainChannel.icon
                }),
                mainChannel.name
            ])
        }

        dropdownButton.on('click', () => {
            this.extendState({showChannelButtons: !this.state.showChannelButtons})
            return false
        })

        var components = [dropdownButton];
        if (this.state.showChannelButtons) {
            components.push($$('div').addClass('dropdown-menu').append(
                channels
            ))
        }


        return $$('div').attr({id: 'w-sharedchannels-main'}).addClass('dropdown').attr({
            'aria-labelledby': 'w-sharedchannels-main-select'
        }).append(components)
    }

    /**
     * Render the channel buttons to share publication with
     */
    renderChannelButtons($$) {
        var ul = $$('ul').addClass('tag-list sc-sharedchannels')

        this.state.channels.forEach((channel) => {
            if (typeof channel.scope !== 'undefined' && channel.scope === 'main') {
                return
            }

            var channelClass = ''

            if (channel.main) {
                channelClass = ' main'
            }
            else if (channel.active) {
                channelClass = ' active'
            }

            ul.append(
                $$('li').addClass('tag-list__item ' + channelClass)
                    .append(
                        $$('img').attr({
                            src: channel.icon
                        })
                    )
                    .attr({
                        title: channel.name,
                        'data-toggle': 'tooltip',
                        'data-placement': 'bottom',
                        'data-trigger': 'manual'
                    })
                    .on('click', () => {
                        if (!channel.main) {
                            this.toggleChannel(channel, false)
                        }
                        return false
                    })
            )
        })

        return ul
    }


    /**
     * Clear all channels including main channel
     */
    clearAllChannels() {
        this.state.channels.forEach((channel) => {
            if (channel.active) {
                this.context.api.newsItem.removeChannel('publicationchannel', channel)
            }
        })

        this.synchronize()
    }

    /**
     * Select or deselect all
     * @parma {HTMLElement} target
     */
    toggleAllChannels(target) {
        var activate = true

        if (target.classList.contains('checked')) {
            activate = false
        }

        this.state.channels.forEach((channel) => {
            if (activate && !channel.active && !channel.main) {
                this.context.api.newsItem.addChannel('publicationchannel', channel)
            }
            else if (!activate && channel.active && !channel.main) {
                this.context.api.newsItem.removeChannel('publicationchannel', channel)
            }

            channel.active = activate
        })

        this.synchronize()
    }

    /**
     * Add or remove publication channel in the newsML.
     * @param {object} channel
     * @param {boolean} setAsMainChannel
     */
    toggleChannel(channel, setAsMainChannel) {
        var mainChannel = this.context.api.newsItem.getMainChannel()
        if (!mainChannel && !setAsMainChannel) {
            this.context.api.ui.showMessageDialog([
                {
                    plugin: 'publicationchannel',
                    type: 'error',
                    message: this.getLabel(
                        'Please choose main publication channel before sharing with other channels')
                }
            ])

            return
        }


        if (channel.active && !setAsMainChannel) {
            this.context.api.newsItem.removeChannel('publicationchannel', channel)
            channel.active = false
        }
        else {
            if (mainChannel && setAsMainChannel) {
                this.context.api.newsItem.removeChannel('publicationchannel', mainChannel)
            }
            this.context.api.newsItem.addChannel(
                'publicationchannel',
                channel,
                setAsMainChannel === true
            )
            channel.active = true
        }

        this.synchronize()
    }

    /**
     * Synchronize UI with newsML services/channels before rerendering
     */
    synchronize() {
        var currentChannels = this.context.api.newsItem.getChannels(),
            activeChannelCount = 0,
            mainChannel = null

        this.state.channels.forEach((channel) => {
            if (currentChannels.some(currentChannel => channel.qcode === currentChannel['qcode'] && currentChannel['@why'] === 'imext:main')) {
                channel.main = true
                channel.active = true
                mainChannel = channel
                activeChannelCount++
            }
            else if (currentChannels.some(currentChannel => channel.qcode === currentChannel['qcode'])) {
                channel.active = true
                channel.main = false
                activeChannelCount++
            }
            else {
                channel.active = false
                channel.main = false
            }
        })

        this.extendState({
            activeChannelCount: activeChannelCount,
            mainChannel: mainChannel
        })
    }
}

export default PublicationchannelComponent