import { DragAndDropHandler } from 'substance'
import embedInfoFromURL from './embedInfoFromURL'
import insertEmbed from './insertEmbed'

// Implements a file drop handler
class DropSocialEmbed extends DragAndDropHandler {
    match(params) {
        let embedInfo = embedInfoFromURL(params.uri)
        return embedInfo.isEmbed
    }

    drop(tx, params) {
        insertEmbed(tx, params.uri)
    }
}

export default DropSocialEmbed