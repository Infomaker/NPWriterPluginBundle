import {Command} from 'substance'
import insertImageFromFile from './insertImageFromFile'

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
                insertImageFromFile(tx, file)
            })
        })
        return true;
    }
}

export default XimimageCommand