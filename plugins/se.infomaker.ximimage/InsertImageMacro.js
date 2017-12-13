//http://www.examplesof.com/photography/nature/rice-terraces.jpg
import {getExtensions} from './models/ImageTypes'

export default {

    execute: function (params, context) {
        const editorSession = context.editorSession
        const url = params.text

        // only react on 'break' and paste
        if (params.action !== 'paste' && params.action !== 'break') {
            return
        }
        if(!url || url.length === 0) {
            return
        }

        const isImage = (filename) => getExtensions().some((extension) => filename.includes(extension))

        if(isImage(url)) {
            editorSession.executeCommand('ximimage-insert-image-url', {
                imageUrl: url,
                isPaste: params.action === 'paste',
                isBreak: params.action === 'break'
            })
            return true
        }
        return false
    }
}
