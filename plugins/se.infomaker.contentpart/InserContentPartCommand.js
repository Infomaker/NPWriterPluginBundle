import {InsertNodeCommand} from 'substance'
import {api, idGenerator} from 'writer'
import uuidv4 from 'uuid/v4'

class InserContentPartCommand extends InsertNodeCommand {

    execute(params) {

        params.editorSession.transaction((tx) => {
            const emptyParamNode = tx.create({
                type: tx.getSchema().getDefaultTextType(),
                content: ''
            })

            const node = {
                type: 'contentpart',
                id: idGenerator(),
                uuid: uuidv4(),
                contentPartUri: this.getDefaultContentPartUri(),
                nodes: [emptyParamNode.id]
            }
            tx.insertBlockNode(node)
        })
    }

    /**
     * Our command is only enabled for the main surface.
     */
    getCommandState(params) {
        let isDisabled = true

        // Check if this is a nodeSelection, in that case the contentMenu tools should be disabled
        if (params.surface && params.selection.isNodeSelection()) {
            isDisabled = true
        } else if (params.surface && params.surface.name === 'body') {
            isDisabled = false
        }

        return {
            disabled: isDisabled
        }
    }

    /**
     * Get the default inline-text uri, e.g. im://inline-text/contentpart, from configuration.
     * If no configuration, null is returned.
     *
     * @returns {*}
     */
    getDefaultContentPartUri() {
        let defaultContentpartUri = null

        api.getConfigValue('se.infomaker.contentpart', 'types', []).forEach((inlineText) => {
            if (inlineText.default) {
                defaultContentpartUri = inlineText.uri
            }
        })
        if(defaultContentpartUri === null) {
            console.error('No content-part-type defined as default')
        }

        return defaultContentpartUri
    }
}

export default InserContentPartCommand
