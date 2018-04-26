# Content part plugin

## Plugin configuration

```json
{
    "id": "se.infomaker.contentpart",
    "name": "contentpart",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-contentpart.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-contentpart.css",
    "enabled": true,
    "mandatory": false,
    "data": {
        "disableUseOfAnnotationTools": false,
        "disableTitleAttribute": false,
        "enableTextTypes": false,
        "types": [
            {
                "name": "Fakta",
                "uri": "im:/content-part/fact",
                "default": true,
                "fields": [
                    { "id": "title" },
                    { "id": "subject" },
                    { "id": "text" },
                    {
                        "id": "alignment",
                        "type": "option",
                        "options": [
                            {
                                "name": "auto",
                                "label": "Automatic",
                                "icon": "fa-align-center"
                            },
                            {
                                "name": "left",
                                "label": "Left",
                                "icon": "fa-align-left"
                            },
                            {
                                "name": "right",
                                "label": "Right",
                                "icon": "fa-align-right"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Sammanfattning",
                "uri": "im:/content-part/summary",
                "fields": [
                    { "id": "title" },
                    { "id": "subject" }
                ]
            },
            {
                "name": "Bakgrund",
                "uri": "im:/content-part/background",
                "fields": [
                    {
                        "id": "title",
                        "icon": "fa-custom-icon"
                    },
                    {
                        "id": "subject",
                        "label": "Custom label for background"
                    },
                    {
                        "id": "customField",
                        "label": "My Custom Field",
                        "type": "datetime"
                    },
                    {
                        "id": "customFieldTwo",
                        "label": "My Second Custom Field"
                    },
                    { "id": "text" }
                ]
            }
        ]
    }
}
```

### Basic Options

| Property                        | Type    | Required | Description                                                                |
| ------------------------------- | :-----: | :------: | -------------------------------------------------------------------------- |
| **types**                       | Array   | `true`   | Content part types. See **Types Options** for configuration                |
| **disableTitleAttribute**       | Boolean | `false`  | Disables rendering of the title-attribute to the NewsML. Default `false`.  |
| **disableUseOfAnnotationTools** | Boolean | `false`  | Disables annotation for all fields.                                        |
| **enableTextTypes**             | Boolean | `false`  | Enables using text styles other than paragraph in the text field           |

### Types Options
```json
{
    "name": "Faktan",
    "uri": "im:/content-part/fact",
    "default": true,
    "fields": [...]
}
```

| Property    | Type    | Required | Description                                                                                         |
| ----------- | :-----: | :------: | --------------------------------------------------------------------------------------------------- |
| **name**    | String  | `false`  | The display name of the content part type                                                           |
| **uri**     | String  | `true`   | A unique URI to identify the content part type. e.g., `"im:/content-part/fact"`                     |
| **default** | Boolean | `false`  | If the type should be the default content part type. **At lease one type should be set as default** |
| **fields**  | Array   | `true`   | Fields on the content part type. See **Fields Options** for configuration                           |

### Fields Options
```javascript
[
    {
        "id": "title",
        "icon": "fa-custom-icon"
    },
    {
        "id": "subject",
        "label": "Custom label for background"
    },
    {
        "id": "customField",
        "label": "My Custom Field",
        "type": "datetime"
    },
    {
        "id": "customFieldTwo",
        "label": "My Second Custom Field"
    },    
    {
        "id": "alignment",
        "type": "option",
        "options": [
            {
                "name": "auto",
                "label": "Automatic",
                "icon": "fa-align-center"
            },
            {
                "name": "left",
                "label": "Left",
                "icon": "fa-align-left"
            },
            {
                "name": "right",
                "label": "Right",
                "icon": "fa-align-right"
            }
        ]
    },
    { "id": "text" }
]
```

| Property  | Type   | Required | Description                                                                                                                     |
| --------- | :----: | :------: | --------------------------------------------------------------------------------------------------------------------------------|
| **id**    | String | `true`   | The name of the field on the node and in the XML output.                                                                        |
| **label** | String | `false`  | Placeholder for field                                                                                                           |
| **icon**  | String | `false`  | Sets icon used for field. Uses [FontAwesome icons](http://fontawesome.io/icons/). e.g., `"fa-twitter"`.                         |
| **type**  | String | `false`  | Choose the type of input to use for the field. One of `"text"`, `"datetime"`, `"date"`, `"time"` or `option`. Default: `"text"` |

`type=option` is used to enable setting "alignment" of content part and needs extra configuration in property `options`
(see example above).

## Output
The plugin adds an object to the idf (`newsItem > contentSet > inlineXML > idf > group`).

```xml
<object id="MTUwLDE4Miw1NCwxMjc" type="x-im/content-part" title="[Plain-text title]">
    <data>
        <title>[Title with annotations]</title>
        <subject>Lorem ipsum dolor sit amet, consectetur adipiscing elit</subject>
        <text format="idf">
            <element id="paragraph-273ee570c1469bdf5badeea5f0524166" type="body">Text element here</element>
        </text>
        <customField>2017-01-30T12:00:00+01:00</customField>
        <alignment>right</alignment>
    </data>
    <links>
        <link uri="im:/content-part/background" rel="content-part"/>
    </links>
</object>
```

* If the config value `"disableTitleAttribute"` is set to `true`, the `object/@title` will not be part of the output.
