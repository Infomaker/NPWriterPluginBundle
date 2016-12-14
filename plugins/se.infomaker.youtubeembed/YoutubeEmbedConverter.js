
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
        } else {
            seconds = node.start;
        }

        const data = $$('data');
        data.append($$('start').append(seconds));

        el.removeAttr('data-id');
        el.append(data);

    }
}