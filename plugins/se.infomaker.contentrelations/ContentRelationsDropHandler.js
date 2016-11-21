import {DragAndDropHandler} from 'substance'
import insertRelatedContentLink from './insertRelatedContentLink'

// Implements a file drop handler
class ContentRelationsDropHandler extends DragAndDropHandler {
    match(params) {
        if (this.isContentRelationsDrop(params.uri)) {
            this.data = this.getDataFromURL(params.uri)

            return true
        }

    }

    isContentRelationsDrop(uri) {
        return uri.indexOf('http://contentrelations') >= 0;

    }

    getDataFromURL(url) {
        const queryParamKey = 'data='
        const dataPosition = url.indexOf(queryParamKey)
        let encodedData = url.substr(dataPosition + queryParamKey.length, url.length)
        return JSON.parse(window.atob(encodedData))
    }

    drop(tx) {

        insertRelatedContentLink(tx, this.data)
    }
}

export default ContentRelationsDropHandler