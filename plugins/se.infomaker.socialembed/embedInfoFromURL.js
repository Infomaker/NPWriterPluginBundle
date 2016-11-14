/*
    Anlyzes an arbitrary url and detects if the url represents a social embed
*/
export default function embedInfoFromURL(url) {
    let result = { isEmbed: true }
    if (url.indexOf('twitter')) {
        result.socialChannel = 'twitter'
    } else if (url.indexOf('instagram')) {
        result.socialChannel = 'instagram'
    } else if (url.indexOf('facebook')) {
        result.socialChannel = 'facebook'
    } else {
        result.isEmbed = false
    }
}