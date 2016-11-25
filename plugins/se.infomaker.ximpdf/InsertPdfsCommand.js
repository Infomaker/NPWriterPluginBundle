import {Command} from 'substance'
import insertPdfCommand from './InsertPdfCommand'
import {api} from 'writer'

/*
    Insert multiple pdf files
*/
class XimPdfCommand extends Command {

    getCommandState(params) {
        return {
            disabled: params.surface ? false : true
        }
    }

    execute(params) {
        params.editorSession.transaction((tx) => {
            Array.prototype.forEach.call(params.files, (file) => {
                insertPdfCommand(tx, file)
            })
        })
        api.editorSession.fileManager.sync()
        return true;
    }
}

export default XimPdfCommand