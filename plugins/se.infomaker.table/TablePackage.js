import TableViewerComponent from './components/TableViewerComponent'

import InsertTableCommand from './commands/InsertTableCommand'
import OpenTableEditorCommand from './commands/OpenTableEditorCommand'
import ToggleHeaderCommand from './commands/ToggleHeaderCommand'

import InsertTableTool from './tools/InsertTableTool'

import TableNode from './nodes/TableNode'
import TableCellNode from './nodes/TableCellNode'

import TableConverter from './converters/TableConverter'
import TableCellConverter from './converters/TableCellConverter'

export default {
    name: 'table',
    id: 'se.infomaker.table',
    version: '{{version}}',
    configure: function(config) {
        config.addNode(TableNode)
        config.addNode(TableCellNode)

        config.addComponent('table', TableViewerComponent)

        config.addCommand('InsertTable', InsertTableCommand)
        config.addCommand('OpenTableEditor', OpenTableEditorCommand)
        config.addCommand('ToggleHeader', ToggleHeaderCommand)

        config.addContentMenuTopTool('InsertTable', InsertTableTool)

        config.addConverter('newsml', TableConverter)
        config.addConverter('newsml', TableCellConverter)

    }
}
