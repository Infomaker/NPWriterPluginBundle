import {platform} from 'substance'

import TableViewerComponent from './components/TableViewerComponent'

import InsertTableCommand from './commands/InsertTableCommand'
import OpenTableEditorCommand from './commands/OpenTableEditorCommand'
import ToggleHeaderCommand from './commands/ToggleHeaderCommand'

import InsertRowCommand from './commands/InsertRowCommand'
import DeleteRowCommand from './commands/DeleteRowCommand'
import InsertColumnCommand from './commands/InsertColumnCommand'
import DeleteColumnCommand from './commands/DeleteColumnCommand'

import TableAnnotationCommand from './commands/TableAnnotationCommand'
import TableCellAnnotationCommand from './commands/TableCellAnnotationCommand'

import InsertTableTool from './tools/InsertTableTool'

import TableNode from './nodes/TableNode'
import TableCellNode from './nodes/TableCellNode'

import TableConverter from './converters/TableConverter'
import TableCellConverter from './converters/TableCellConverter'
import TableContextMenuTool from './tools/TableContextMenuTool';

const MAIN_TOOL_GROUP = 'context-menu-primary'
const TABLE_COMMAND_GROUP = 'table'
const TABLE_ANNOTATION_COMMAND_GROUP = 'table-annotation'
const COMMANDS = {
    // General
    INSERT_TABLE: 'table-insert-table',
    OPEN_EDITOR: 'table-open-editor',
    TOGGLE_HEADER: 'table-toggle-header',
    TOGGLE_FOOTER: 'table-toggle-footer',

    // Insertion
    INSERT_ROW_BEFORE: 'table-insert-row-before',
    INSERT_ROWS_BEFORE: 'table-insert-rows-before',
    INSERT_ROW_AFTER: 'table-insert-row-after',
    INSERT_ROWS_AFTER: 'table-insert-rows-after',
    INSERT_COL_BEFORE: 'table-insert-col-before',
    INSERT_COLS_BEFORE: 'table-insert-cols-before',
    INSERT_COL_AFTER: 'table-insert-col-after',
    INSERT_COLS_AFTER: 'table-insert-cols-after',

    // Deletion
    DELETE_ROW: 'table-delete-row',
    DELETE_ROWS: 'table-delete-rows',
    DELETE_COLUMN: 'table-delete-col',
    DELETE_COLUMNS: 'table-delete-cols',

    // Annotations
    STRONG: 'table-strong',
    EMPHASIS: 'table-emphasis',
    CELL_STRONG: 'table-cell-strong',
    CELL_EMPHASIS: 'table-cell-emphasis',
}


export default {
    name: 'table',
    id: 'se.infomaker.table',
    version: '{{version}}',
    configure: function(config) {
        config.addNode(TableNode)
        config.addNode(TableCellNode)

        config.addComponent('table', TableViewerComponent)


        // Table commands: general
        config.addCommand(COMMANDS.INSERT_TABLE, InsertTableCommand)
        config.addContentMenuTopTool(COMMANDS.INSERT_TABLE, InsertTableTool)

        config.addCommand('OpenTableEditor', OpenTableEditorCommand)
        config.addCommand('ToggleHeader', ToggleHeaderCommand)

        // Insert row before
        config.addCommand(COMMANDS.INSERT_ROW_BEFORE, InsertRowCommand, {
            insertBefore: true,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleRows: true
        })
        config.addTool(COMMANDS.INSERT_ROW_BEFORE, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_ROW_BEFORE, { 'fontawesome': 'fa-angle-up' })

        // Insert rows before
        config.addCommand(COMMANDS.INSERT_ROWS_BEFORE, InsertRowCommand, {
            insertBefore: true,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleRows: true
        })
        config.addTool(COMMANDS.INSERT_ROWS_BEFORE, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_ROWS_BEFORE, { 'fontawesome': 'fa-angle-double-up' })

        // Insert row after
        config.addCommand(COMMANDS.INSERT_ROW_AFTER, InsertRowCommand, {
            insertBefore: false,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleRows: true
        })
        config.addTool(COMMANDS.INSERT_ROW_AFTER, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_ROW_AFTER, { 'fontawesome': 'fa-angle-down' })

        // Insert rows after
        config.addCommand(COMMANDS.INSERT_ROWS_AFTER, InsertRowCommand, {
            insertBefore: false,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleRows: true
        })
        config.addTool(COMMANDS.INSERT_ROWS_AFTER, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_ROWS_AFTER, { 'fontawesome': 'fa-angle-double-down' })

        // Insert column before
        config.addCommand(COMMANDS.INSERT_COL_BEFORE, InsertColumnCommand, {
            insertBefore: true,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleCols: true
        })
        config.addTool(COMMANDS.INSERT_COL_BEFORE, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_COL_BEFORE, { 'fontawesome': 'fa-angle-left' })

        // Insert columns before
        config.addCommand(COMMANDS.INSERT_COLS_BEFORE, InsertColumnCommand, {
            insertBefore: true,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleCols: true
        })
        config.addTool(COMMANDS.INSERT_COLS_BEFORE, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_COLS_BEFORE, { 'fontawesome': 'fa-angle-double-left' })

        // Insert column after
        config.addCommand(COMMANDS.INSERT_COL_AFTER, InsertColumnCommand, {
            insertBefore: false,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleCols: true
        })
        config.addTool(COMMANDS.INSERT_COL_AFTER, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_COL_AFTER, { 'fontawesome': 'fa-angle-right' })

        // Insert columns after
        config.addCommand(COMMANDS.INSERT_COLS_AFTER, InsertColumnCommand, {
            insertBefore: false,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleCols: true
        })
        config.addTool(COMMANDS.INSERT_COLS_AFTER, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.INSERT_COLS_AFTER, { 'fontawesome': 'fa-angle-double-right' })

        // Delete row
        config.addCommand(COMMANDS.DELETE_ROW, DeleteRowCommand, {
            deleteMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleRows: true
        })
        config.addTool(COMMANDS.DELETE_ROW, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.DELETE_ROW, { 'fontawesome': 'fa-remove' })

        // Delete rows
        config.addCommand(COMMANDS.DELETE_ROWS, DeleteRowCommand, {
            deleteMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleRows: true
        })
        config.addTool(COMMANDS.DELETE_ROWS, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.DELETE_ROWS, { 'fontawesome': 'fa-remove' })

        // Delete column
        config.addCommand(COMMANDS.DELETE_COLUMN, DeleteColumnCommand, {
            deleteMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleCols: true
        })
        config.addTool(COMMANDS.DELETE_COLUMN, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.DELETE_COLUMN, { 'fontawesome': 'fa-remove' })

        // Delete columns
        config.addCommand(COMMANDS.DELETE_COLUMNS, DeleteColumnCommand, {
            deleteMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleCols: true
        })
        config.addTool(COMMANDS.DELETE_COLUMNS, TableContextMenuTool, {
            toolGroup: MAIN_TOOL_GROUP
        })
        config.addIcon(COMMANDS.DELETE_COLUMNS, { 'fontawesome': 'fa-remove' })

        // Annotation commands
        config.addCommand(COMMANDS.STRONG, TableAnnotationCommand, { nodeType: 'strong', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })
        config.addCommand(COMMANDS.EMPHASIS, TableAnnotationCommand, { nodeType: 'emphasis', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })
        config.addCommand(COMMANDS.CELL_STRONG, TableCellAnnotationCommand, { nodeType: 'strong', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })
        config.addCommand(COMMANDS.CELL_EMPHASIS, TableCellAnnotationCommand, { nodeType: 'emphasis', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })










        config.addConverter('newsml', TableConverter)
        config.addConverter('html', TableConverter)
        config.addConverter('newsml', TableCellConverter)
        config.addConverter('html', TableCellConverter)

        config.addKeyboardShortcut('cmd+d', {command: COMMANDS.INSERT_ROW_BEFORE, hej: true}, true, 'name here')

        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+b', {command: 'table-strong'}, true, 'table-strong')
            config.addKeyboardShortcut('cmd+i', {command: 'table-emphasis'}, true, 'table-emphasis')
        } else {
            config.addKeyboardShortcut('ctrl+b', {command: 'table-strong'}, true, 'table-strong')
            config.addKeyboardShortcut('ctrl+i', {command: 'table-emphasis'}, true, 'table-emphasis')
        }











        config.addLabel('table-insert-row-before', {
            en: 'Insert row above',
            sv: 'Infoga rad över'
        })
        config.addLabel('table-insert-row-after', {
            en: 'Insert row below',
            sv: 'Infoga rad under'
        })
        config.addLabel('table-insert-rows-before', {
            en: 'Insert rows above',
            sv: 'Infoga rader över'
        })
        config.addLabel('table-insert-rows-after', {
            en: 'Insert rows below',
            sv: 'Infoga rader under'
        })
        config.addLabel('table-insert-col-before', {
            en: 'Insert column to the left',
            sv: 'Infoga kolumn till vänster'
        })
        config.addLabel('table-insert-col-after', {
            en: 'Insert column to the right',
            sv: 'Infoga kolumn till höger'
        })
        config.addLabel('table-insert-cols-before', {
            en: 'Insert columns to the left',
            sv: 'Infoga kolumner till vänster'
        })
        config.addLabel('table-insert-cols-after', {
            en: 'Insert columns to the right',
            sv: 'Infoga kolumner till höger'
        })
        config.addLabel('table-delete-row', {
            en: 'Delete row',
            sv: 'Ta bort rad'
        })
        config.addLabel('table-delete-rows', {
            en: 'Delete rows',
            sv: 'Ta bort rader'
        })
        config.addLabel('table-delete-col', {
            en: 'Delete column',
            sv: 'Ta bort kolumn'
        })
        config.addLabel('table-delete-cols', {
            en: 'Delete columns',
            sv: 'Ta bort kolumner'
        })


    }
}
