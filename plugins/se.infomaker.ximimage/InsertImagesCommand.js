import insertImage from './models/insertImage'
import {api, WriterCommand} from 'writer'

/*
    Insert multiple images based on a list of image files
*/
class XimimageCommand extends WriterCommand {

    execute(params) {
        params.editorSession.transaction((tx) => {
            Array.prototype.forEach.call(params.files, (file) => {
                insertImage(tx, file)
            })
        })
        api.editorSession.fileManager.sync()
        return true;
    }
}

export default XimimageCommand
