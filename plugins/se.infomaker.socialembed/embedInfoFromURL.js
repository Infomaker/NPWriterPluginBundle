/*
    Anlyzes an arbitrary url and detects if the url represents a social embed
*/
export default function embedInfoFromURL(url) {
    let result = { isEmbed: true }
    if (url.indexOf('twitter') > 0) {
        result.socialChannel = 'twitter'
    } else if (url.indexOf('instagram') > 0) {
        result.socialChannel = 'instagram'
    } else if (url.indexOf('facebook') > 0) {
        result.socialChannel = 'facebook'
    } else {
        result.isEmbed = false
    }
    return result
}