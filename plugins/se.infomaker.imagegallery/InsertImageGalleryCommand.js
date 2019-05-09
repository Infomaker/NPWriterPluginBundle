import {WriterCommand} from 'writer'
import ImageGalleryConverter from './ImageGalleryConverter'
import uuidv4 from 'uuid/v4'

class InsertImageGalleryCommand extends WriterCommand {

    execute(params, context) { // eslint-disable-line
        const {editorSession} = params
        const {type, dataType} = ImageGalleryConverter

        const imageGalleryNode = {
            type: type,
            dataType: dataType,
            uuid: uuidv4()
        }

        editorSession.transaction((tx) => {
            tx.insertBlockNode(imageGalleryNode)
        })
    }
}

export default InsertImageGalleryCommand
