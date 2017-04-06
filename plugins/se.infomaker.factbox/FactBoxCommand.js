import {InsertNodeCommand} from 'substance'
import {api, idGenerator} from 'writer'

class FactBoxCommand extends InsertNodeCommand {

    execute(params) {
        params.editorSession.transaction((tx) => {
            const id = idGenerator()
            const placeholder = tx.create({
                type: tx.getSchema().getDefaultTextType(),
                content: ''
            })

            const container = tx.create({
                type: 'container',
                id: id + '-container'
            })

            const node = {
                type: 'factbox',
                id: id,
                title: '',
                vignette: '',
                nodes: [container.id],
                inlineTextUri: this.getDefaultInlineTextUri()
            }

            container.show(placeholder.id)

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
     * Get the default inline-text uri, e.g. im://inline-text/factbox, from configuration.
     * If no configuration, null is returned.
     *
     * @returns {*}
     */
    getDefaultInlineTextUri() {
        let defaultInlineTextUri = null

        api.getConfigValue('se.infomaker.factbox', 'inlineTexts', []).forEach((inlineText) => {
            if (inlineText.default) {
                defaultInlineTextUri = inlineText.uri
            }
        })

        return defaultInlineTextUri
    }
}

export default FactBoxCommand
