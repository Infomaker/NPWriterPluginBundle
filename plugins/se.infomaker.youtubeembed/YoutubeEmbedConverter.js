/*
 <object id="MjA5LDIxMiwxMTcsMTQ2"
 type="x-im/youtube"
 url="https://www.youtube.com/watch?v=7BXCMyPh_nI&amp;t=631s"
 uri="https://www.youtube.com/watch?v=7BXCMyPh_nI&amp;t=631s">
 <data>
 <start>0</start>
 </data>
 </object>

 type: 'youtubeembed',
 dataType: 'string',
 url: 'string',
 errorMessage: { type: 'string', optional: true },
 // Payload (after embed has been resolved)
 html: { type: 'string', optional: true },
 thumbnail_url: { type: 'string', default: ""},
 uri: { type: 'string', optional: true },
 linkType: { type: 'string', optional: true },
 title: { type: 'string', default: "" },
 */

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


    },

    export: function (node, el, converter) {
        var $$ = converter.$$;
        el.attr({
            id: node.id,
            type: node.dataType,
            url: node.url,
            uri: node.uri
        });

        el.removeAttr('data-id');

    }
}