const { BlockNode } = substance

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
        let url = this.url
        if (url.indexOf('twitter') > -1) {
            this._loadTwitter(url, context, cb)
        } else if (url.indexOf('instagram') > -1) {
            this._loadInstagram(url, context, cb)
        } else if (this.url.indexOf('facebook') > -1) {
            this._loadFacebook(url, context, cb)
        } else {
            cb(new Error('Could not resolve an embed for this url'))
        }
    }

    /*
        Determines the payload that must be present
        in order to consider the resource resolved
    */
    hasPayload() {
        return Boolean(this.html)
    }

    _loadInstagram(url, context, cb) {
        cb(new Error('Instagram Embed: Not yet implemented'))
    }

    _loadFacebook(url, context, cb) {
        console.log('loading facebook embed')
        cb(new Error('Facebook Embed: Not yet implemented'))
    }

    /**
     * Load twitter Oembed
     */
    _loadTwitter(url, context, cb) {
        let twitterBase = "https://api.twitter.com/1/statuses/oembed.json?id="
        let twitterPostId = /status*\/(\d+)/.exec(url) // TODO maybe improve this regex

        $.ajax({
            url: twitterBase + twitterPostId[1],
            dataType: 'jsonp'
        }).done((result) => {
            cb(null, {
                uri: 'im://tweet/' + twitterPostId[1],
                linkType: 'x-im/tweet',
                html: result.html,
                author: result.author,
                socialChannel: 'Twitter',
                socialChannelIcon: 'fa-twitter'
            })
        }).fail((xhr, err) => {
            cb(err)
        })
    }
}

// Payload fetching will be managed by the resource manager
SocialembedNode.isResource = true

SocialembedNode.define({
    type: 'socialembed',
    dataType: 'string',
    url: 'string',
    // errorMessage is part of the resource contract
    errorMessage: { type: 'string', optional: true },
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
