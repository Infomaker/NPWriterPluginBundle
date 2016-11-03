const { BlockNode } = substance
import forEach from 'lodash/forEach'

/* globals $ */

/*
    TODO:
        - Remove jquery dependency
        - Add other services (Youtube, Soundcloud, etc.)
        - Consider using a service for embed resolving: E.g. https://iframely.com/
*/
class SocialembedNode extends BlockNode {

    /*
        Fetches embed HTML and metadata
    */
    fetchPayload(context, cb) {
        console.log('fetching payload...')
        let url = this.url

        // Example urls:
        // ----------------
        // http://api.instagram.com/oembed?url=http://instagr.am/p/fA9uwTtkSN/
        // https://api.twitter.com/1/statuses/oembed.json?id=614146049003909124
        // https://www.facebook.com/plugins/post/oembed.json/?url=https://www.facebook.com/20531316728/posts/10154009990506729/
        if (url.indexOf('twitter') > -1) {
            this.loadTwitter(url, context, cb)
        } else if (url.indexOf('instagram') > -1) {
            this.loadInstagram(url, context, cb)
        } else if (this.url.indexOf('facebook') > -1) {
            this.loadFacebook(url, context, cb)
        }
    }

    /*
        Determines the payload that must be present
        in order to consider the resource resolved
    */
    hasPayload() {
        return Boolean(this.html)
    }

    /**
     * Load twitter Oembed
     */
    loadTwitter(url, context, cb) {
        let twitterBase = "https://api.twitter.com/1/statuses/oembed.json?id="
        let twitterPostId = /status*\/(\d+)/.exec(url) // TODO maybe improve this regex

        $.ajax({
            url: twitterBase + twitterPostId[1],
            dataType: 'jsonp'
        }).done((result) => {
            this._updateNode({
                uri: 'im://tweet/' + twitterPostId[1],
                linkType: 'x-im/tweet',
                html: result.html,
                author: result.author,
                socialChannel: 'Twitter',
                socialChannelIcon: 'fa-twitter'
            }, context)
            cb(null)
        }).fail((xhr, err) => {
            cb(err)
        })
    }

    /*
        Fill in node payload

        ATTENTION: this must be done via a transaction, otherwise
        the component will not rerender accordingly.
    */
    _updateNode(props, context) {
        let editorSession = context.editorSession
        editorSession.transaction((tx) => {
            forEach(props, (val, key) => {
                tx.set([this.id, key], val)
            })
        })
    }
}

// Payload fetching will be managed by the resource manager
SocialembedNode.isResource = true

SocialembedNode.define({
    type: 'socialembed',
    dataType: 'string',
    url: 'string',
    // Payload (after embed has been resolved)
    html: { type: 'string', optional: true },
    uri: { type: 'string', optional: true },
    linkType: { type: 'string', optional: true },
    title: { type: 'string', optional: true },
    author: { type: 'string', optional: true },
    socialChannel: { type: 'string', optional: true },
    socialChannelIcon: { type: 'string', optional: true }
})

export default SocialembedNode
