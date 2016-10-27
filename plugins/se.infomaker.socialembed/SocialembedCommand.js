const { Command } = substance
/* globals $ */

class SocialembedCommand extends Command {

    getCommandState() {
        return { disabled: false }
    }

    execute(params, context) {
        this.fetchEmbed(params.url, function(err, node) {
            return context.api.document.insertBlockNode(node.type, node)
        })
        return true
    }

    fetchEmbed(url, cb) {
        // Example urls:
        // ----------------
        // http://api.instagram.com/oembed?url=http://instagr.am/p/fA9uwTtkSN/
        // https://api.twitter.com/1/statuses/oembed.json?id=614146049003909124
        // https://www.facebook.com/plugins/post/oembed.json/?url=https://www.facebook.com/20531316728/posts/10154009990506729/
        if (url.indexOf('twitter') > -1) {
            this.loadTwitter(url, cb)
        } else if (url.indexOf('instagram') > -1) {
            this.loadInstagram(url, cb)
        } else if (this.url.indexOf('facebook') > -1) {
            this.loadFacebook(url, cb)
        }
    }

    /**
     * Load twitter Oembed
     */
    loadTwitter(url, cb) {
        let twitterBase = "https://api.twitter.com/1/statuses/oembed.json?id="
        let twitterPostId = /status*\/(\d+)/.exec(url) // TODO maybe improve this regex

        $.ajax({
            url: twitterBase + twitterPostId[1],
            dataType: 'jsonp'
        }).done((result) => {
            let node = {
                type: 'socialembed',
                dataType: 'x-im/socialembed',
                url: result.url,
                uri: 'im://tweet/' + twitterPostId[1],
                linkType: 'x-im/tweet',
                html: result.html,
                author: result.author,
                socialChannel: 'Twitter',
                socialChannelIcon: 'fa-twitter'
            }
            cb(null, node)
        }).fail((xhr, err) => {
            cb(err)
        })
    }
}

export default SocialembedCommand