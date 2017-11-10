import {api} from 'writer'

/**
 * Returns either 'save' or 'publish' depending on the publication status of the article
 * @return {string} `'save'` or `'publish'`
 */
export default function saveOrPublish() {
    const pubStatus = api.newsItem.getPubStatus()

    switch (pubStatus.qcode) {
        case 'imext:draft':
        case 'stat:canceled':
            return 'save'
        default:
            return 'publish'
    }
}
