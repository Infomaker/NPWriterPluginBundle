# Table plugin

Modified version of the built-in substance [table package](https://github.com/substance/substance/tree/v1.0.0-beta.6/packages/table).

Enables creating and editing tables inside the writer.

## Plugin configuration

```json
{
    "id": "se.infomaker.table",
    "name": "table",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-table.js",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-table.css",
    "mandatory": false,
    "enabled": true
}
```

No `data` configuration needed.

## Writer configuration

Please note that `forcePlaintextPaste` must be set to `false` to enable pasting tables from external sources.

## Output

### Minimal

A 2x2 table without caption, head, or foot

```xml
<object id="table-1" type="x-im/table">
    <data>
        <tbody>
            <tr>
                <td id="table-cell-1">Cell 1</td>
                <td id="table-cell-2">Cell 2</td>
            </tr>
            <tr>
                <td id="table-cell-3">Cell 1</td>
                <td id="table-cell-4">Cell 2</td>
            </tr>
        </tbody>
    </data>
</object>
```

### Full

A table with head, body, foot, and caption. Also shows use of colspans and rowspans

```xml
<object id="table-1" type="x-im/table">
    <data>
        <caption>This is the (optional) caption of the table</caption>
        <thead>
            <tr>
                <th id="table-cell-1" colspan="4">This is the (optional) head of the table</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td id="table-cell-2">Cell 1</td>
                <td id="table-cell-3">Cell 2</td>
                <td id="table-cell-4" rowspan="2">Cell 3 (with a rowspan of 2)</td>
                <td id="table-cell-5">Cell 4</td>
            </tr>
            <tr>
                <td id="table-cell-6">Cell 1</td>
                <td id="table-cell-7">Cell 2</td>
                <td id="table-cell-8">Cell 4</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td id="table-cell-9" colspan="4">This is the (optional) foot of the table</td>
            </tr>
        </tfoot>
    </data>
</object>
```


## Commands

### General commands
| Command               | Description                                  | Context        | Keybinding  |
| --------------------- | -------------------------------------------- | -------------- | ----------- |
| `table-insert-table`  | Inserts a new table at the current selection | In writer area |             |
| `table-toggle-header` | Toggles table header                         | Table selected | cmd+shift+h |
| `table-toggle-footer` | Toggles table footer                         | Table selected | cmd+shift+f |

### Modifier commands
| Command                    | Description                                                            | Context                                                             | Keybinding |
| -------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------- |
| `table-insert-row-before`  | Inserts a single row above current row                                 | Single cell selected or selection area contains single row          |            |
| `table-insert-rows-before` | Inserts as many rows as selected above current row                     | Selection area contains multiple rows                               |            |
| `table-insert-row-after`   | Inserts a single row below current row                                 | Single cell selected or selection area contains single row          |            |
| `table-insert-rows-after`  | Inserts as many rows as selected below current row                     | Selection area contains multiple rows                               |            |
| `table-insert-col-before`  | Inserts a single column to the left of the current column              | Single cell selected or selection area contains single column       |            |
| `table-insert-cols-before` | Inserts as many columns as selected to the left of the current column  | Selection area contains multiple columns                            |            |
| `table-insert-col-after`   | Inserts a single column to the right of the current column             | Single cell selected or selection area contains single column       |            |
| `table-insert-cols-after`  | Inserts as many columns as selected to the right of the current column | Selection area contains multiple columns                            |            |
| `table-delete-row`         | Removes current row                                                    | Single cell selected or selection area contains single row          |            |
| `table-delete-rows`        | Removes all selected rows                                              | Selection area contains multiple rows                               |            |
| `table-delete-col`         | Removes current column                                                 | Single cell selected or selection area contains single column       |            |
| `table-delete-cols`        | Removes all selected columns                                           | Selection area contains multiple columns                            |            |
| `table-merge-cells`        | Merge two or more cells into a single cell with rowspan/colspan        | Selection area contains multiple cells                              |            |
| `table-unmerge-cells`      | Removes all selected columns                                           | Single merged cell selected or selection area contains merged cells |            |

### Annotation commands
| Command               | Description                                                                  | Context                                | Keybinding |
| --------------------- | ---------------------------------------------------------------------------- | -------------------------------------- | ---------- |
| `table-strong`        | Applies `strong` annotation to selected cell or area                         | Single cell selected or selection area | cmd+b      |
| `table-emphasis`      | Applies `emphasis` annotation to selected cell or area                       | Single cell selected or selection area | cmd+i      |
| `table-cell-strong`   | Applies `strong` annotation to single cell *(only used by `table-strong`)*   | Single cell selected or selection area |            |
| `table-cell-emphasis` | Applies `emphasis` annotation to single cell *(only used by `table-emphasis`)* | Single cell selected or selection area |            |

