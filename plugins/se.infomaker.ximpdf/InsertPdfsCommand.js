import { WriterCommand } from 'writer'
import insertPdfCommand from './InsertPdfCommand'
import removePDFNode from './RemovePDFNode'
import {api} from 'writer'

/*
 Insert multiple pdf files
 */
class XimpdfCommand extends WriterCommand {

    execute(params) {

        const nodeIds = []

        if (typeof params.files === 'string') {
            params.editorSession.transaction((tx) => {
                nodeIds.push(insertPdfCommand(tx, params.files))
            })
        } else {
            params.editorSession.transaction((tx) => {
                params.files.forEach(file => {
                    nodeIds.push(insertPdfCommand(tx, file))
                })
            })
        }
        api.editorSession.fileManager.sync()
            .catch(err => {
                const silent = (err.type === 'abort')
                nodeIds.forEach(nodeId => removePDFNode(nodeId, err, silent))
            })
        return true;
    }
}

export default XimpdfCommand