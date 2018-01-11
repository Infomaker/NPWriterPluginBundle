import '../scss/table-context.scss'
import {Tool} from 'substance'

/**
 * A suggestion tool
 */
class TableContextMenuTool extends Tool {
    // render($$) {
    //     // let node = this.props.node
    //     let Button = this.getComponent('button')
    //     let el = $$('div').addClass('sc-correction-tool')
    //     console.info('Tool props:', this)

    //     if (this.props.showInContext) {
    //         el.append([
    //             $$(Button, {
    //                 label: this.getCommandName(),
    //                 style: this.props.style,
    //                 disabled: true
    //             })
    //         ])
    //     }

    //     return el
    // }

    getClassNames() {
        const classNames = ['sc-table-context-tool']
        if (this.props.disabled) { classNames.push('disabled') }
        if (!this.props.showInContext) { classNames.push('hidden') }
        return classNames.join(' ')
    }

}

export default TableContextMenuTool
