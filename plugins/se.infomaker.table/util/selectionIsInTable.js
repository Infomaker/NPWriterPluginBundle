import {api} from 'writer'

export default function selectionIsInTable(selection) {
    if (!selection) { return false }

    if (selection.isPropertySelection()) {
        return _propertySelectionIsInTable(selection)
    }

    if (selection.isNodeSelection()) {
        return _nodeSelectionIsInTable(selection)
    }

    return false
}

function _propertySelectionIsInTable(selection) {
    const nodeId = selection.getNodeId()
    if (!nodeId) { return false }

    const node = api.editorSession.document.get(nodeId)
    if (node && node.type === 'table-cell') {
        // console.info('Table cell selected', node)
        return Boolean(node.table)
    }

    return false
}

function _nodeSelectionIsInTable(selection) {
    const nodeId = selection.getNodeId()
    if (!nodeId) { return false }

    const node = api.editorSession.document.get(nodeId)
    if (node && node.type === 'table') {
        return true
    }

    return false
}
