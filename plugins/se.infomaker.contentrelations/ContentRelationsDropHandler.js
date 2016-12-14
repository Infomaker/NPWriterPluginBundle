import {DragAndDropHandler} from 'substance'
import {api} from 'writer'
import insertRelatedContentLink from './insertRelatedContentLink'


// Implements a file drop handler
class ContentRelationsDropHandler extends DragAndDropHandler {
    match(params) {
        if (!params.uri) {
            return false
        }

        if (this.isContentRelationsArticleDrop(params) || this.isNpDroplink(params)) {

            if(params.isNpDroplink) {
                this.data = this.getDataFromNpDroplink(params.uri)
            } else if(params.isContentRelations) {
                this.data = this.getDataFromURL(params.uri)
            } else {
                return false
            }
            return true
        }
    }


    /**
     * Get npdroplinkMatcher from plugin config
     * Then check if it matches
     * If a match is found params is updated with isNpDroplink=true
     *
     * @param params
     * @returns {boolean}
     */
    isNpDroplink(params) {
        const npDropLinkRegex = api.getConfigValue('se.infomaker.contentrelations', 'npDropLinkMatcher')
        const re = new RegExp(npDropLinkRegex);
        const urlMatches = re.exec(params.uri)

        if(urlMatches && urlMatches.length >= 1) {
            params.isNpDroplink = true
            return true
        }
    }

    /**
     * Check if drop link contains x-im-entity
     * If link is dropped from sidebar the uri should container x-im-entity
     * @param params
     * @returns {boolean}
     */
    isContentRelationsArticleDrop(params) {
        if(params.uri.indexOf('x-im-entity://x-im/article') >= 0) {
            params.isContentRelations = true
            return true
        }
    }


    /**
     * Find UUID and Name from the NpDroplink
     * @param link
     * @returns {{name: *, uuid: *}}
     */
    getDataFromNpDroplink(link) {
        link = decodeURIComponent(link)

        function decodeLabel(xml) {
            const reg = new RegExp(".*<name>([^<]+)");
            const result = reg.exec(xml);
            return result[1];
        }

        function decodeUuid(xml) {
            // <uri>http://52.49.83.6/client/?id=435e5040-d94e-11e5-b5d2-0a1d41d68578</uri>
            const reg = new RegExp(".*\?id=([^<]+)");
            const result = reg.exec(xml);
            return result[1];
        }

        const name = decodeLabel(link)
        const uuid = decodeUuid(link)

        return {
            name: name,
            uuid: uuid
        }
    }


    /**
     * Get data from URL dropped from sidebar
     * @param url
     */
    getDataFromURL(url) {
        const queryParamKey = 'data='
        const dataPosition = url.indexOf(queryParamKey)
        let encodedData = url.substr(dataPosition + queryParamKey.length, url.length)
        return JSON.parse(window.atob(encodedData))
    }

    drop(tx) {

        /*
         * data to pass should contain
         * {
         *  name: name,
         *  uuid: uui
         * }
         */

        insertRelatedContentLink(tx, this.data)
    }
}

export default ContentRelationsDropHandler
