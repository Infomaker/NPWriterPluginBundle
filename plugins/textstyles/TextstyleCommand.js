import {WriterCommand, api} from 'writer'

class TextstyleCommand extends WriterCommand {
    execute() {
        api.editorSession.executeCommand('switch-text-type', {
            textType: this.config.textType
        })
    }
}

export default TextstyleCommand
