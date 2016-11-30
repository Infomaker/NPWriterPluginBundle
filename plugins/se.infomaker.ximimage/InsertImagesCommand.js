import {Command, idGenerator} from 'substance'
// import insertImage from './insertImage'
import {api} from 'writer'

/*
    Insert multiple images based on a list of image files
*/
class XimimageCommand extends Command {

    getCommandState(params) {
        return {
            disabled: params.surface && params.surface.name === 'body' ? false : true
        }
    }

    execute(params) {
        params.editorSession.transaction((tx) => {
            Array.prototype.forEach.call(params.files, (file) => {
                //insertImage(tx, file)
                this.insertImage(file)
            })
        })
        api.editorSession.fileManager.sync()
        return true;
    }

    insertImage(tx, fileData) {
        let isFile = fileData instanceof File,
            mimeType = ''

        if (isFile) {
            mimeType = fileData.type
        }
        else if (typeof fileData === 'string') {
            mimeType = 'image/' + fileData.split('.').pop()
        }
        else {
            throw new Error('Unsupported file data. Must be file or string.')
        }

        let imageFileNode = tx.create({
            type: 'ximimagefile',
            nodeId: idGenerator(),
            fileType: 'image',
            mimeType: mimeType,
            sourceFile: isFile ? fileData: null,
            sourceurl: !isFile ? fileData : null
        })

        tx.insertBlockNode({
            id: imageFileNode.nodeId,
            type: 'ximimage',
            imageFile: imageFileNode.id,
            caption: '',
            alttext: '',
            credit: '',
            alignment: ''
        })

    }
}

export default XimimageCommand
