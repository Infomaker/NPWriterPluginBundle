import {api} from 'writer'

/**
 * @private
 * @param {string} url The URL which to test against the provided list
 * @param {RegExp[]} list The list whick to test the provided URL against
 * @returns {boolean}
 */
const _testUrlAgainstList = (url, list) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i].test(url)) {
            return true
        }
    }
    return false
}

/**
 * Return true if the the provided URL matches the whitelist or if the whitelist is empty
 * @param {string} url The URL to match against the whitelist
 * @returns {boolean}
 */
const urlInWhitelist = (url) => {
    const whitelist = api.getConfigValue('se.infomaker.iframely', 'urlWhitelist', [])
    if (whitelist.length === 0) {
        return true
    }
    return _testUrlAgainstList(url, whitelist)
}

/**
 * Return true if the the provided URL matches the blacklist or false if the blacklist is empty
 * @param {string} url The URL to match against the blacklist
 * @returns {boolean}
 */
const urlInBlacklist = (url) => {
    const blacklist = api.getConfigValue('se.infomaker.iframely', 'urlBlacklist', [])
    if (blacklist.length === 0) {
        return false
    }
    return _testUrlAgainstList(url, blacklist)
}

/**
 * @param {string} url The URL which to test against a whitelist and a blacklist
 * @returns {boolean}
 */
const urlShouldBeMatched = (url) => {
    return urlInWhitelist(url) && !urlInBlacklist(url)
}

export default urlShouldBeMatched
