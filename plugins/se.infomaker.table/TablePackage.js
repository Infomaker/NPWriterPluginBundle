import {platform} from 'substance'

import TableNode from './nodes/TableNode'
import TableCellNode from './nodes/TableCellNode'

import TableViewerComponent from './components/TableViewerComponent'

import InsertTableCommand from './commands/InsertTableCommand'
import ToggleHeaderCommand from './commands/ToggleHeaderCommand'
import ToggleFooterCommand from './commands/ToggleFooterCommand'
import InsertRowCommand from './commands/InsertRowCommand'
import DeleteRowCommand from './commands/DeleteRowCommand'
import InsertColumnCommand from './commands/InsertColumnCommand'
import DeleteColumnCommand from './commands/DeleteColumnCommand'
import MergeCellsCommand from './commands/MergeCellsCommand'
import UnmergeCellsCommand from './commands/UnmergeCellsCommand'
import TableAnnotationCommand from './commands/TableAnnotationCommand'
import TableCellAnnotationCommand from './commands/TableCellAnnotationCommand'

import InsertTableTool from './tools/InsertTableTool'
import TableContextMenuTool from './tools/TableContextMenuTool'

import HTMLTableConverter from './converters/HTMLTableConverter'
import XMLTableConverter from './converters/XMLTableConverter'
import TableCellConverter from './converters/TableCellConverter'
import ToggleIndexCommand from './commands/ToggleIndexCommand'
import SetFormatCommand from './commands/SetFormatCommand'

const MAIN_TOOL_GROUP = 'context-menu-primary'
const TABLE_COMMAND_GROUP = 'table'
const TABLE_ANNOTATION_COMMAND_GROUP = 'table-annotation'
const COMMANDS = {
    // General
    INSERT_TABLE: 'table-insert-table',
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

    // Merge/unmerge
    MERGE_CELLS: 'table-merge-cells',
    UNMERGE_CELLS: 'table-unmerge-cells',

    // Annotations
    STRONG: 'table-strong',
    EMPHASIS: 'table-emphasis',
    CELL_STRONG: 'table-cell-strong',
    CELL_EMPHASIS: 'table-cell-emphasis',

    // Meta
    META_TOGGLE_INDEX: 'table-meta-toggle-index',
    META_SET_FORMAT_NUMBER: 'table-meta-set-format-number',
    META_SET_FORMAT_TEXT: 'table-meta-set-format-text',
    META_CLEAR_FORMAT: 'table-meta-clear-format'
}


export default {
    name: 'table',
    id: 'se.infomaker.table',
    version: '{{version}}',
    configure: function(config) {
        config.addNode(TableNode)
        config.addNode(TableCellNode)

        config.addComponent(this.name, TableViewerComponent)

        // Table commands: general
        config.addCommand(COMMANDS.INSERT_TABLE, InsertTableCommand)
        config.addCommand(COMMANDS.TOGGLE_HEADER, ToggleHeaderCommand)
        config.addCommand(COMMANDS.TOGGLE_FOOTER, ToggleFooterCommand)
        config.addCommand(COMMANDS.INSERT_ROW_BEFORE, InsertRowCommand, {
            insertBefore: true,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleRows: true
        })
        config.addCommand(COMMANDS.INSERT_ROWS_BEFORE, InsertRowCommand, {
            insertBefore: true,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleRows: true
        })
        config.addCommand(COMMANDS.INSERT_ROW_AFTER, InsertRowCommand, {
            insertBefore: false,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleRows: true
        })
        config.addCommand(COMMANDS.INSERT_ROWS_AFTER, InsertRowCommand, {
            insertBefore: false,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleRows: true
        })
        config.addCommand(COMMANDS.INSERT_COL_BEFORE, InsertColumnCommand, {
            insertBefore: true,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleCols: true
        })
        config.addCommand(COMMANDS.INSERT_COLS_BEFORE, InsertColumnCommand, {
            insertBefore: true,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleCols: true
        })
        config.addCommand(COMMANDS.INSERT_COL_AFTER, InsertColumnCommand, {
            insertBefore: false,
            insertMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleCols: true
        })
        config.addCommand(COMMANDS.INSERT_COLS_AFTER, InsertColumnCommand, {
            insertBefore: false,
            insertMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleCols: true
        })
        config.addCommand(COMMANDS.DELETE_ROW, DeleteRowCommand, {
            deleteMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleRows: true
        })
        config.addCommand(COMMANDS.DELETE_ROWS, DeleteRowCommand, {
            deleteMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleRows: true
        })
        config.addCommand(COMMANDS.DELETE_COLUMN, DeleteColumnCommand, {
            deleteMultiple: false,
            commandGroup: TABLE_COMMAND_GROUP,
            disabledOnMultipleCols: true
        })
        config.addCommand(COMMANDS.DELETE_COLUMNS, DeleteColumnCommand, {
            deleteMultiple: true,
            commandGroup: TABLE_COMMAND_GROUP,
            requiresMultipleCols: true
        })
        config.addCommand(COMMANDS.MERGE_CELLS, MergeCellsCommand, {
            commandGroup: TABLE_COMMAND_GROUP
        })
        config.addCommand(COMMANDS.UNMERGE_CELLS, UnmergeCellsCommand, {
            commandGroup: TABLE_COMMAND_GROUP
        })
        config.addCommand(COMMANDS.META_TOGGLE_INDEX, ToggleIndexCommand, {
            commandGroup: TABLE_COMMAND_GROUP
        })

        config.addCommand(COMMANDS.META_SET_FORMAT_NUMBER, SetFormatCommand, {
            commandGroup: TABLE_COMMAND_GROUP,
            format: 'number'
        })
        config.addCommand(COMMANDS.META_SET_FORMAT_TEXT, SetFormatCommand, {
            commandGroup: TABLE_COMMAND_GROUP,
            format: 'text'
        })
        config.addCommand(COMMANDS.META_CLEAR_FORMAT, SetFormatCommand, {
            commandGroup: TABLE_COMMAND_GROUP,
            format: null
        })



        // Converters
        config.addConverter('newsml', XMLTableConverter)
        config.addConverter('html', HTMLTableConverter)
        config.addConverter('newsml', TableCellConverter)
        config.addConverter('html', TableCellConverter)

        // Annotation commands
        config.addCommand(COMMANDS.STRONG, TableAnnotationCommand, { nodeType: 'strong', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })
        config.addCommand(COMMANDS.EMPHASIS, TableAnnotationCommand, { nodeType: 'emphasis', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })
        config.addCommand(COMMANDS.CELL_STRONG, TableCellAnnotationCommand, { nodeType: 'strong', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })
        config.addCommand(COMMANDS.CELL_EMPHASIS, TableCellAnnotationCommand, { nodeType: 'emphasis', commandGroup: TABLE_ANNOTATION_COMMAND_GROUP })

        // Icons
        config.addIcon(COMMANDS.DELETE_COLUMNS, { 'fontawesome': 'fa-remove' })
        config.addIcon(COMMANDS.DELETE_COLUMN, { 'fontawesome': 'fa-remove' })
        config.addIcon(COMMANDS.DELETE_ROWS, { 'fontawesome': 'fa-remove' })
        config.addIcon(COMMANDS.DELETE_ROW, { 'fontawesome': 'fa-remove' })
        config.addIcon(COMMANDS.INSERT_COLS_AFTER, { 'fontawesome': 'fa-angle-double-right' })
        config.addIcon(COMMANDS.INSERT_COL_AFTER, { 'fontawesome': 'fa-angle-right' })
        config.addIcon(COMMANDS.INSERT_COLS_BEFORE, { 'fontawesome': 'fa-angle-double-left' })
        config.addIcon(COMMANDS.INSERT_COL_BEFORE, { 'fontawesome': 'fa-angle-left' })
        config.addIcon(COMMANDS.INSERT_ROWS_AFTER, { 'fontawesome': 'fa-angle-double-down' })
        config.addIcon(COMMANDS.INSERT_ROW_AFTER, { 'fontawesome': 'fa-angle-down' })
        config.addIcon(COMMANDS.INSERT_ROWS_BEFORE, { 'fontawesome': 'fa-angle-double-up' })
        config.addIcon(COMMANDS.INSERT_ROW_BEFORE, { 'fontawesome': 'fa-angle-up' })

        // Keyboard shortcuts
        if (platform.isMac) {
            config.addKeyboardShortcut('cmd+shift+h', {command: COMMANDS.TOGGLE_HEADER}, true, COMMANDS.TOGGLE_HEADER)
            config.addKeyboardShortcut('cmd+shift+f', {command: COMMANDS.TOGGLE_FOOTER}, true, COMMANDS.TOGGLE_FOOTER)
            config.addKeyboardShortcut('cmd+b', {command: COMMANDS.STRONG}, true, COMMANDS.STRONG)
            config.addKeyboardShortcut('cmd+i', {command: COMMANDS.EMPHASIS}, true, COMMANDS.EMPHASIS)
        } else {
            config.addKeyboardShortcut('cmd+shift+h', {command: COMMANDS.TOGGLE_HEADER}, true, COMMANDS.TOGGLE_HEADER)
            config.addKeyboardShortcut('ctrl+shift+f', {command: COMMANDS.TOGGLE_FOOTER}, true, COMMANDS.TOGGLE_FOOTER)
            config.addKeyboardShortcut('ctrl+b', {command: COMMANDS.STRONG}, true, COMMANDS.STRONG)
            config.addKeyboardShortcut('ctrl+i', {command: COMMANDS.EMPHASIS}, true, COMMANDS.EMPHASIS)
        }

        // Tools
        config.addContentMenuTopTool(COMMANDS.INSERT_TABLE, InsertTableTool)

        const mainToolgroupTools = [
            COMMANDS.TOGGLE_HEADER,
            COMMANDS.TOGGLE_FOOTER,
            COMMANDS.INSERT_ROW_BEFORE,
            COMMANDS.INSERT_ROWS_BEFORE,
            COMMANDS.INSERT_ROW_AFTER,
            COMMANDS.INSERT_ROWS_AFTER,
            COMMANDS.INSERT_COL_BEFORE,
            COMMANDS.INSERT_COLS_BEFORE,
            COMMANDS.INSERT_COL_AFTER,
            COMMANDS.INSERT_COLS_AFTER,
            COMMANDS.DELETE_ROW,
            COMMANDS.DELETE_ROWS,
            COMMANDS.DELETE_COLUMN,
            COMMANDS.DELETE_COLUMNS,
            COMMANDS.MERGE_CELLS,
            COMMANDS.UNMERGE_CELLS,
            COMMANDS.META_TOGGLE_INDEX,
            COMMANDS.META_SET_FORMAT_NUMBER,
            COMMANDS.META_SET_FORMAT_TEXT,
            COMMANDS.META_CLEAR_FORMAT
        ]

        mainToolgroupTools.forEach(tool => {
            config.addTool(tool, TableContextMenuTool, { toolGroup: MAIN_TOOL_GROUP })
        })

        // Labels
        config.addLabel('table-caption', {
            en: 'Table caption',
            sv: 'Tabellrubrik'
        })
        config.addLabel(COMMANDS.INSERT_TABLE, {
            en: 'Insert table',
            sv: 'Infoga tabell'
        })
        config.addLabel(COMMANDS.TOGGLE_HEADER, {
            en: 'Toggle header',
            sv: 'Visa/dölj tabellhuvud'
        })
        config.addLabel(COMMANDS.TOGGLE_FOOTER, {
            en: 'Toggle footer',
            sv: 'Visa/dölj tabellfot'
        })
        config.addLabel(COMMANDS.INSERT_ROW_BEFORE, {
            en: 'Insert row above',
            sv: 'Infoga rad över'
        })
        config.addLabel(COMMANDS.INSERT_ROWS_BEFORE, {
            en: 'Insert rows above',
            sv: 'Infoga rader över'
        })
        config.addLabel(COMMANDS.INSERT_ROW_AFTER, {
            en: 'Insert row below',
            sv: 'Infoga rad under'
        })
        config.addLabel(COMMANDS.INSERT_ROWS_AFTER, {
            en: 'Insert rows below',
            sv: 'Infoga rader under'
        })
        config.addLabel(COMMANDS.INSERT_COL_BEFORE, {
            en: 'Insert column to the left',
            sv: 'Infoga kolumn till vänster'
        })
        config.addLabel(COMMANDS.INSERT_COLS_BEFORE, {
            en: 'Insert columns to the left',
            sv: 'Infoga kolumner till vänster'
        })
        config.addLabel(COMMANDS.INSERT_COL_AFTER, {
            en: 'Insert column to the right',
            sv: 'Infoga kolumn till höger'
        })
        config.addLabel(COMMANDS.INSERT_COLS_AFTER, {
            en: 'Insert columns to the right',
            sv: 'Infoga kolumner till höger'
        })
        config.addLabel(COMMANDS.DELETE_ROW, {
            en: 'Delete row',
            sv: 'Ta bort rad'
        })
        config.addLabel(COMMANDS.DELETE_ROWS, {
            en: 'Delete rows',
            sv: 'Ta bort rader'
        })
        config.addLabel(COMMANDS.DELETE_COLUMN, {
            en: 'Delete column',
            sv: 'Ta bort kolumn'
        })
        config.addLabel(COMMANDS.DELETE_COLUMNS, {
            en: 'Delete columns',
            sv: 'Ta bort kolumner'
        })
        config.addLabel(COMMANDS.MERGE_CELLS, {
            en: 'Merge cells',
            sv: 'Sammanfoga celler'
        })
        config.addLabel(COMMANDS.UNMERGE_CELLS, {
            en: 'Unmerge cells',
            sv: 'Separera celler'
        })


        config.addLabel(COMMANDS.META_TOGGLE_INDEX, {
            en: 'Toggle Index',
            sv: 'Lägg till/ta bort index'
        })
        config.addLabel(COMMANDS.META_SET_FORMAT_NUMBER, {
            en: 'Set number format',
            sv: 'Sätt siffer-format'
        })
        config.addLabel(COMMANDS.META_SET_FORMAT_TEXT, {
            en: 'Set text format',
            sv: 'Sätt text-format'
        })
        config.addLabel(COMMANDS.META_CLEAR_FORMAT, {
            en: 'Clear format',
            sv: 'Rensa format'
        })
    }
}
