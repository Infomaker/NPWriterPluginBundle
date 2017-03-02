import {DragAndDropHandler} from "substance";

// Implements a file drop handler
class DropUri extends DragAndDropHandler {


    match(params) {
        let match = /^\s*(https?:\/\/([^\s]+))\s*$/.exec(params.uri)
        if (!match) return false
        // take the url, select the node, and run the social embed command
        let url = match[1]

        if(url.indexOf('youtube.com') > 0) {
            return true
        }
    }

    drop(tx, params) {

        tx.insertBlockNode({
            type: 'youtubeembed',
            dataType: 'x-im/youtube',
            url: params.uri
        })
    }

}

export default DropUri
