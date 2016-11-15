import {BlockNode} from 'substance'
import {api} from 'writer'

class YoutubeEmbedNode extends BlockNode {

    /**
     * Method called from a resourcemanager to fetch asynchronos payload
     *
     * @param context
     * @param {function} cb Callback that's invoked from ResourceManager, updates the node with correct values if success
     *
     */
    fetchPayload(context, cb) {
        let url = this.url

        var baseUrl = "http://youtube.com/oembed?url=";
        var apiUrl = baseUrl+this.url;
        api.router.get('/api/proxy/', {url: apiUrl})
            .then(response => response.json())
            .then(json => {
                cb(null, {
                    html:json.html,
                    uri:url,
                    thumbnail_url: json.thumbnail_url,
                    title: json.title
                })
            })
            .catch((e) => {
                cb(e)
            })

    }

    /*
     Determines the payload that must be present
     in order to consider the resource resolved
     */
    hasPayload() {
        return Boolean(this.html)
    }

}

YoutubeEmbedNode.isResource = true

YoutubeEmbedNode.define({
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
})

export default YoutubeEmbedNode