import {Command} from 'substance'
import insertImage from './insertImage'
import {api} from 'writer'

/*
    Insert multiple images based on a list of image files
*/
class XimimageCommand extends Command {

    getCommandState(params) {
        return {
            disabled: params.surface ? false : true
        }
    }

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