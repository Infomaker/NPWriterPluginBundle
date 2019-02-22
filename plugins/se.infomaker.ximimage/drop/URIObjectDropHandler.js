import {DragAndDropHandler} from 'substance'
import {api} from 'writer'

/**
 * DropHandler that matches, parses and handles insertion of objects through x-im-object URIs
 *
 * A URI must be  in the format of "x-im-object://[im-type]?data=[data]".
 * - im-type    This is the type of the object (eg im-image, im-pdf)
 * - data       A URI encoded JSON object specifying source of the object and the data associated.
 *
 * See examples for an encoded version and a pseudo code like example for clarity
 *
 * @example
 * x-im-object://x-im/image?data=%7B%22source%22%3A%20%7B%22url%22%3A%20%22https%3A%2F%2Fegyptianstreets.com%2Fwp-content%2Fuploads%2F2015%2F08%2F246596.jpg%22%2C%22name%22%3A%20%22egyptianstreets.com%22%2C%22id%22%3A%20%222015%2F08%2F246596.jpg%22%7D%2C%22data%22%3A%20%7B%22caption%22%3A%20%22Sufi%20whirling%20dervishes%20performing%20at%20Beit%20Sanqar%20al-Saady%20in%20Cairo%22%7D%7D
 *
 * @example
 * x-im-object://x-im/image?data={
 *     source: {
 *         uri: 'https://egyptianstreets.com/wp-content/uploads/2015/08/246596.jpg',
 *         type: 'egyptianstreets.com'
 *     },
 *     data: {
 *         caption: 'ufi whirling dervishes performing at Beit Sanqar al-Saady in Cairo'
 *     }
 * }
 */
class URIObjectDropHandler extends DragAndDropHandler {

    constructor(imType, DropExecutor) {
        super()
        this.matchType = imType || 'x-im/image'
        this.executor = new DropExecutor()
    }

    match(params) {
        return params.uri && this.executor.parseDropURIType(params.uri) === this.matchType
    }

    drop(tx, params) {
        const uriObject = this.executor.parseDropURI(params.uri)
        const droppedURIs = api.editorSession.dragManager.dragState.data.uris

        if (!uriObject.type === 'x-im/image') {
            throw new Error(`Unsupported type <${uriObject.type}> in drop`)
        }

        this.executor.insert(
            tx,
            uriObject,
            droppedURIs[droppedURIs.length - 1] === params.uri
        )
    }
}

export {URIObjectDropHandler}
