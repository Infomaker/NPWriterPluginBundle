import { WriterCommand } from 'writer'
import insertPdfCommand from './InsertPdfCommand'
import {api} from 'writer'

/*
 Insert multiple pdf files
 */
class XimpdfCommand extends WriterCommand {

    execute(params) {
        if (typeof params.files === 'string') {
            params.editorSession.transaction((tx) => {
                insertPdfCommand(tx, params.files)
            })
        } else {
            params.editorSession.transaction((tx) => {
                Array.prototype.forEach.call(params.files, (file) => {
                    insertPdfCommand(tx, file)
                })
            })
        }
        api.editorSession.fileManager.sync()
        return true;
    }
}

export default XimpdfCommand