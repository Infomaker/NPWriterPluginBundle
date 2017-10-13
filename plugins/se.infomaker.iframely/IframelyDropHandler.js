import { DragAndDropHandler } from 'substance'
import insertIframelyEmbed from './insertIframelyEmbed'


class IframelyDropHandler extends DragAndDropHandler {
    match(params) {
        return params.type === 'uri'
    }

    drop(tx, params) {
        insertIframelyEmbed(tx, params.uri)
    }
}

export default IframelyDropHandler
