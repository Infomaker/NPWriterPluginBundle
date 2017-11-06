import {WriterCommand} from 'writer'
import ImageGalleryConverter from './ImageGalleryConverter'

class InsertImageGalleryCommand extends WriterCommand {

    execute(params, context) {
        const {editorSession} = params
        const {type, dataType} = ImageGalleryConverter
        
        const imageGalleryNode = {
            type: type,
            dataType: dataType,
        }

        editorSession.transaction((tx) => {
            tx.insertBlockNode(imageGalleryNode)
        })
    }
}

export default InsertImageGalleryCommand
