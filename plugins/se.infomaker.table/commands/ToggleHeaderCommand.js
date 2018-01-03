import { Command } from 'substance'

class ToggleHeaderCommand extends Command {
    execute(params) {
        console.info('ToggleHeaderCommand params:', params)
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

        console.info('Toggle header command disabled:', isDisabled, 'Params:', params)
        return {
            disabled: isDisabled
        }
    }
}

export default ToggleHeaderCommand
