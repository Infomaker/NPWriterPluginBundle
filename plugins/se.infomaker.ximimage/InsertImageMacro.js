//http://www.examplesof.com/photography/nature/rice-terraces.jpg
import {api} from 'writer'

export default {

    execute: function (params, context) {
        const editorSession = context.editorSession
        const url = params.text

        // only react on 'break' (as medium does)
        if (params.action !== 'paste') {
            return
        }
        if(!url || url.length === 0) {
            return
        }

        const isImage = api.getPluginModule('se.infomaker.ximimage.isImage')

        if(isImage(url, api)) {
            editorSession.executeCommand('ximimage-insert-image-url', {
                imageUrl: url,
                isPaste: true
            })
            return true
        }
        return false
    }
}
