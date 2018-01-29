import '../scss/table-context.scss'
import {Tool} from 'substance'

/**
 * Table creation context menu tool
 */
class TableContextMenuTool extends Tool {
    getClassNames() {
        const classNames = ['sc-table-context-tool']
        if (this.props.disabled) { classNames.push('disabled') }
        if (!this.props.showInContext) { classNames.push('hidden') }
        return classNames.join(' ')
    }
}

export default TableContextMenuTool
