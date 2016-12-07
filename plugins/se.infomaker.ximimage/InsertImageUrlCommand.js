import insertImage from './insertImage'
import {api, WriterCommand} from 'writer'

/*

 */
class InsertImageUrlCommand extends WriterCommand {


    execute(params) {

        api.editorSession.transaction((tx) => {
            insertImage(tx, params.imageUrl)
        })
        api.editorSession.fileManager.sync()

    }
}

export default InsertImageUrlCommand
