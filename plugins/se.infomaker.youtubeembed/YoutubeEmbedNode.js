import {BlockNode} from 'substance'
import {api} from 'writer'

class YoutubeEmbedNode extends BlockNode {

    /**
     * Parses the string embed code and changes the width value
     * @param {string} initialHTML
     */
    getEmbedCode(initialHTML) {
        const temp = document.createElement('div');
        temp.innerHTML = initialHTML

        const youtubeEmbedElement = temp.firstChild
        youtubeEmbedElement.setAttribute('width', '100%')

        return youtubeEmbedElement.outerHTML
    }


    /**
     * Method called from a resourcemanager to fetch asynchronos payload
     *
     * @param context
     * @param {function} cb Callback that's invoked from ResourceManager, updates the node with correct values if success
     *
     */
    fetchPayload(context, cb) {
        let url = this.url

        var baseUrl = "https://youtube.com/oembed?url=";
        var apiUrl = baseUrl+this.url;
        api.router.get('/api/resourceproxy/', {url: apiUrl})
            .then(response => response.json())
            .then(json => {

                const html = this.getEmbedCode(json.html)
                cb(
                    null,
                    {
                        html:html,
                        uri:url,
                        oembed: json,
                        thumbnail_url: json.thumbnail_url,
                        title: json.title
                    },
                    {
                        history: false
                    }
                )
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
    oembed: { type: 'object', optional: true },
    url: 'string',
    start: { type: 'string', default: '00:00' },
    errorMessage: { type: 'string', optional: true },
    // Payload (after embed has been resolved)
    html: { type: 'string', optional: true },
    thumbnail_url: { type: 'string', default: ""},
    uri: { type: 'string', optional: true },
    linkType: { type: 'string', optional: true },
    title: { type: 'string', default: "" },
})

export default YoutubeEmbedNode
