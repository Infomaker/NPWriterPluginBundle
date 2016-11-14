import {Command} from 'substance'
import insertImage from './insertImage'

/*
    Insert multiple images based on a list of image files
*/
class XimimageCommand extends Command {

    getCommandState() {
        return {
            disabled: false
        }
    }

    execute(params) {
        params.editorSession.transaction((tx) => {
            params.files.forEach((file) => {
                insertImage(tx, file)
            })
        })
        return true;
    }
}

export default XimimageCommand