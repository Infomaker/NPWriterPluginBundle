
import {moment} from 'writer'

export default {
    type: 'youtubeembed',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object[type="x-im/youtube"]');
    },

    import: function (el, node) {
        node.dataType = el.attr('type')
        node.url = el.attr('url')
        node.uri = el.attr('uri')

        const startTimeEl = el.find('data > start')
        let startTimeFromEl = 0
        if(startTimeEl) {
            startTimeFromEl = startTimeEl.text()
        }
        const startTime = moment.duration(parseInt(startTimeFromEl, 10), 'seconds');
        node.start = startTime.minutes()+":"+startTime.seconds();
    },

    export: function (node, el, converter) {
        const $$ = converter.$$

        el.attr({
            id: node.id,
            type: node.dataType,
            url: node.url,
            uri: node.uri
        });

        let seconds
        if (node.start && node.start.indexOf(':') > -1) {
            const startTime = node.start.split(':');
            seconds = parseInt(startTime[0], 10) * 60 + parseInt(startTime[1], 10);
        }
        else {
            seconds = node.start;
        }

        const data = $$('data');
        data.append($$('start').append(seconds));

        const api = converter.context.api
        let configLabel = api.getConfigValue('se.infomaker.youtubeembed', 'alternateLinkTitle', 'Click link to view content')

        const oembed = node.oembed
        configLabel = configLabel.replace('{author_name}', oembed.author_name)
        configLabel = configLabel.replace('{author_url}', oembed.author_url)
        configLabel = configLabel.replace('{provider_name}', oembed.provider_name)
        configLabel = configLabel.replace('{provider_url}', oembed.provider_url)
        configLabel = configLabel.replace('{text}', oembed.title ? oembed.title : '')

        const alternateLink = converter.$$('link'),
            alternateImageLink = $$('link'),
            imageData = $$('data')

        alternateLink.attr({
            rel: 'alternate',
            type: 'text/html',
            url: node.url,
            title: configLabel
        })

        // Create the image/alternate
        alternateImageLink.attr({
            rel: 'alternate',
            type: 'image/jpg',
            url: node.thumbnail_url
        })

        // Check if we have width and height of thumbail
        if(oembed.thumbnail_width) {
            imageData.append($$('width').append(oembed.thumbnail_width))
        }

        if(oembed.thumbnail_height) {
            imageData.append($$('height').append(oembed.thumbnail_height))
        }

        if(imageData.childNodes.length > 0) {
            alternateImageLink.append(imageData)
        }

        el.removeAttr('data-id')
        el.append([
            data,
            $$('links').append([
                alternateLink,
                alternateImageLink
            ])
        ])

    }
}
