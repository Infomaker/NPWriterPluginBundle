import {BlockNode} from 'substance'
import embedInfoFromURL from './embedInfoFromURL'
import {api, uuidv5} from 'writer'

class SocialembedNode extends BlockNode {

    /*
     Fetches embed HTML and metadata
     */
    fetchPayload(context, cb) {
        let url = this.url
        let embedInfo = embedInfoFromURL(url)

        switch (embedInfo.socialChannel) {
            case 'twitter':
                this._loadTwitter(url, context, cb)
                break;
            case 'instagram':
                this._loadInstagram(url, context, cb)
                break;
            case 'facebook':
                this._loadFacebook(url, context, cb)
                break;
            case 'vimeo':
                this._loadVimeo(url, context, cb)
                break;
            case 'soundcloud':
                this._loadSoundcloud(url, context, cb)
                break;
            default:
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


    /**
     * Load an Instagram OEmbed from a URL
     * Updates the node when fetch is successfull
     *
     * @param url
     * @param context
     * @param cb
     * @private
     */
    _loadInstagram(url, context, cb) {

        const instagramBase = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}&omitscript=true`;

        api.router.get('/api/resourceproxy', {url: instagramBase})
            .then(response => api.router.checkForOKStatus(response))
            .then(response => api.router.toJson(response))
            .then(json => {
                cb(null, {
                    author: json.author_url,
                    html: json.html,
                    uri: `im://instagram/${json.media_id}`,
                    url: url,
                    title: json.title,
                    linkType: 'x-im/instagram',
                    socialChannel: 'Instagram',
                    socialChannelIcon: 'fa-instagram'
                })
            })
            .catch((error) => {
                cb(error)
            })


    }


    /**
     * Load a facebook oembed from an url
     * @param url
     * @param context
     * @param cb
     * @private
     */
    _loadFacebook(url, context, cb) {

        const apiBase = `https://www.facebook.com/plugins/post/oembed.json?url=${encodeURIComponent(url)}&omitscript=true`

        let postId = uuidv5('url', 'https://facebook.com')
        const matches = /.*[/=](\d+)/.exec(url);

        if (matches && matches.length === 2) {
            postId = matches[1];
        }

        api.router.get('/api/resourceproxy', {url: apiBase})
            .then(response => api.router.checkForOKStatus(response))
            .then(response => api.router.toJson(response))
            .then(json => {
                cb(null, {

                    author: json.author_url,
                    html: json.html,
                    uri: `im://facebook-post/${postId}`,
                    url: json.url,
                    linkType: 'x-im/facebook-post',
                    socialChannel: 'Facebook',
                    socialChannelIcon: 'fa-facebook'
                })
            })
            .catch((error) => {
                cb(error)
            })


    }

    /**
     * Load twitter Oembed
     */
    _loadTwitter(url, context, cb) {

        const twitterBase = `https://api.twitter.com/1/statuses/oembed.json?url=${encodeURIComponent(url)}&hide_media=false&omit_script=true`
        const twitterPostId = /status*\/(\d+)/.exec(url) // TODO maybe improve this regex
        const oembedURL = encodeURIComponent(twitterBase)

        api.router.get('/api/resourceproxy', {url: oembedURL})
            .then(response => api.router.checkForOKStatus(response))
            .then(response => api.router.toJson(response))
            .then(json => {
                cb(null, {
                    author: json.author_url,
                    html: json.html,
                    uri: `im://tweet/${twitterPostId[1]}`,
                    url: json.url,
                    linkType: 'x-im/tweet',
                    socialChannel: 'Twitter',
                    socialChannelIcon: 'fa-twitter'
                })
            })
            .catch((error) => {
                cb(error)
            })

    }

    /**
     * Load vimeo Oembed
     */
    _loadVimeo(url, context, cb) {
        const vimeoBase = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&format=json&omitscript=true`

        api.router.get('/api/resourceproxy', {url: vimeoBase})
            .then(response => api.router.checkForOKStatus(response))
            .then(response => api.router.toJson(response))
            .then(json => {
                cb(null, {
                    author: json.author_url,
                    html: json.html,
                    uri: `im://vimeo/${json.video_id}`,
                    url: url,
                    title: json.title,
                    linkType: 'x-im/vimeo',
                    socialChannel: 'Vimeo',
                    socialChannelIcon: 'fa-vimeo'
                })
            })
            .catch((error) => {
                cb(error)
            })
    }

    /**
     * Load soundcloud Oembed
     */
    _loadSoundcloud(url, context, cb) {
        const soundcloudBase = `http://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}&omitscript=true`
        const oembedURL = encodeURIComponent(soundcloudBase)

        api.router.get('/api/resourceproxy', {url: oembedURL})
            .then(response => api.router.checkForOKStatus(response))
            .then(response => api.router.toJson(response))
            .then(json => {
                cb(null, {
                    author: json.author_url,
                    html: json.html,
                    uri: `im://soundcloud/${encodeURIComponent(json.author_name + '.' + json.title)}`,
                    url: url,
                    title: json.title,
                    linkType: 'x-im/soundcloud',
                    socialChannel: 'Soundcloud',
                    socialChannelIcon: 'fa-soundcloud'
                })
            })
            .catch((error) => {
                cb(error)
            })
    }
}

// Payload fetching will be managed by the resource manager
SocialembedNode.isResource = true

SocialembedNode.define({
    type: 'socialembed',
    dataType: 'string',
    url: 'string',
    data: {type: 'string', optional: true},
    // errorMessage is part of the resource contract
    errorMessage: {type: 'string', optional: true},
    // Payload (after embed has been resolved)
    html: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    linkType: {type: 'string', optional: true},
    author: {type: 'string', optional: true},
    socialChannel: {type: 'string', optional: true},
    socialChannelIcon: {type: 'string', optional: true}
})

export default SocialembedNode
