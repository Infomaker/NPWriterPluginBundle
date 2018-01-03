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

- InsertTable
- OpenTableEditor
- ToggleTableHeader
- ToggleTableFooter
- InsertRowBefore
- InsertRowAfter
- InsertColumnBefore
- InsertColumnAfter
- DeleteRow
- DeleteColumn
