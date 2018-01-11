# Table plugin

Modified version of the built-in substance [table package](https://github.com/substance/substance/tree/v1.0.0-beta.6/packages/table).


## Plugin configuration

```json
{
    "id": "se.infomaker.table",
    "name": "table",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-table.js",
    "mandatory": false,
    "enabled": true
}
```

No `data` configuration needed.

## Output
```xml
<table id="table-1">
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
</table>
```

## Commands

### General commands
| Command               | Description                                  | Context        |
| --------------------- | -------------------------------------------- | -------------- |
| `table-insert-table`  | Inserts a new table at the current selection | In writer area |
| `table-open-editor`   | Opens table editor                           | Table selected |
| `table-toggle-header` | Toggles table header                         | Table selected |
| `table-toggle-footer` | Toggles table footer                         | Table selected |

### Insertion/deletion commands
| Command                    | Description                                                            | Context                                                       |
| -------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| `table-insert-row-before`  | Inserts a single row above current row                                 | Single cell selected or selection area contains single row    |
| `table-insert-rows-before` | Inserts as many rows as selected above current row                     | Selection area contains multiple rows                         |
| `table-insert-row-after`   | Inserts a single row below current row                                 | Single cell selected or selection area contains single row    |
| `table-insert-rows-after`  | Inserts as many rows as selected below current row                     | Selection area contains multiple rows                         |
| `table-insert-col-before`  | Inserts a single column to the left of the current column              | Single cell selected or selection area contains single column |
| `table-insert-cols-before` | Inserts as many columns as selected to the left of the current column  | Selection area contains multiple columns                      |
| `table-insert-col-after`   | Inserts a single column to the right of the current column             | Single cell selected or selection area contains single column |
| `table-insert-cols-after`  | Inserts as many columns as selected to the right of the current column | Selection area contains multiple columns                      |
| `table-delete-row`         | Removes current row                                                    | Single cell selected or selection area contains single row    |
| `table-delete-rows`        | Removes all selected rows                                              | Selection area contains multiple rows                         |
| `table-delete-col`         | Removes current column                                                 | Single cell selected or selection area contains single column |
| `table-delete-cols`        | Removes all selected columns                                           | Selection area contains multiple columns                      |

### Annotation commands
| Command               | Description                                                                  | Context                                |
| --------------------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| `table-strong`        | Applies `strong` annotation to selected cell or area                         | Single cell selected or selection area |
| `table-emphasis`      | Applies `emphasis` annotation to selected cell or area                       | Single cell selected or selection area |
| `table-cell-strong`   | Applies `strong` annotation to single cell *(only used by `table-strong`)*   | Single cell selected or selection area |
| `table-cell-emphasis` | Applies `strong` annotation to single cell *(only used by `table-emphasis`)* | Single cell selected or selection area |

