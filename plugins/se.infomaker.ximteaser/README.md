# Multi Teaser Plugin
This plugin handles teaser content for multiple types. Types depend on
the plugin configuration (see below).

Each teaser type has configurable data-type, content fields, and image options.

## Output
The plugin adds one or more objects to the metadata-section of the idf.

```xml
<metadata xmlns="http://www.infomaker.se/newsml/1.0">
    <object id="MjE5LDE2MywyNDgsMjA4" type="x-im/teaser" title="Lorem ipsum">
        <data>
            <title>
                <title>
                    <strong id="strong-10fab667cd669d088f1a04deb90ff32d">Lorem ipsum <em id="emphasis-01524d79eb8d6d0c54fbf04e9f871df4">dolor sit</em></strong>
                </title>
            </title>
            <text>Mauris at libero condimentum sapien malesuada efficitur non id nibh.</text>
            <subject>Lorem ipsum dolor sit amet, consectetur adipiscing elit</subject>
            <customText>Duis aute irure dolor</customText>
        </data>
        <links>
            <link rel="image" type="x-im/image" uri="im://image/fmglga0fK54ZwKjnufQgG027eOA.png" uuid="00000000-0000-0000-0000-000000000000">
                <data>
                    <width>850</width>
                    <height>514</height>
                </data>
                <links>
                    <link rel="crop" type="x-im/crop" title="16:9" uri="im://crop/0.1075/0.08264462809917356/0.51375/0.48140495867768596"/>
                    <link rel="crop" type="x-im/crop" title="1:1" uri="im://crop/0.1975/0/0.605/1"/>
                </links>
            </link>
            <link rel="article" type="x-im/article" title="Tintin i Hajsjön" uuid="22885008-ec24-4b59-8edf-67109322f49c"/>
        </links>
    </object>
    <object id="NjMsMTExLDIzMSwxNzE" type="x-im/facebook-teaser" title="Lorem ipsum">
        <data>
            <title>Lorem ipsum</title>
            <text format="idf">
                <element id="paragraph-88beb76cb6af9ca39303bebc20497c56" type="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</element>
                <element id="paragraph-360f09442467b39801c6f60971b9c02c" type="body">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</element>
                <element id="paragraph-337d42c0a735a1faab645382bbf39fff" type="body">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</element>
            </text>
            <customDateField>2017-01-30</customDateField>
        </data>
    </object>
</metadata>
```

**Notes on Output**
 * `object > links` is optional, i.e. if no images or related articles are present this element is omitted.
 * `object > data` may contain different elements depending on the teaser's `fields`-configuration. See [Custom Fields](#custom-fields)
 * `object[@title]` is deprecated but will contain title value if `object > title` is not present

## Plugin configuration
For the most basic configuration, with one teaser and the standard text fields, see [Basic plugin configuration example](#basic-configuration-example).

```json
{
  "plugins": [
    {
      "id": "se.infomaker.ximteaser",
      "name": "ximteaser",
      "url": "https://plugins.writer.infomaker.io/releases/4.1.0/im-ximteaser.js",
      "style": "https://plugins.writer.infomaker.io/releases/4.1.0/im-ximteaser.css",
      "mandatory": false,
      "enabled": true,
      "data": {
        "disableUseOfAnnotationToolsForFields": [],
        "teaserPosition": "top",
        "types": [
          {
            "label": "Teaser",
            "type": "x-im/teaser",
            "fields": [
              {
                "icon": "fa-flag",
                "id": "subject",
                "label": "Subject"
              },
              {
                "icon": "fa-header",
                "id": "title",
                "label": "Rubrik"
              },
              {
                "icon": "fa-paragraph",
                "id": "text",
                "label": "Text"
              },
              {
                "icon": "fa-paragraph",
                "id": "customText",
                "type": "text",
                "label": "Custom Text"
              }
            ],
            "icon": "fa-newspaper-o",
            "enableRelatedArticles": false,
            "imageoptions": {
              "crops": {
                "16:9": [16, 9],
                "1:1": [1, 1],
                "4:3": [4, 3],
                "8:5": [8, 5]
              },
              "imageinfo": true,
              "softcrop": true
            }
          },
          {
            "type": "x-im/facebook-teaser",
            "label": "Facebook",
            "fields": [
              {
                "icon": "fa-flag",
                "id": "subject",
                "label": "Subject"
              },
              {
                "icon": "fa-header",
                "id": "title",
                "label": "Rubrik"
              },
              {
                "icon": "fa-paragraph",
                "id": "text",
                "label": "Text"
              },
              {
                "id": "customDateField",
                "label": "Custom Date Field",
                "icon": "fa-calendar",
                "type": "date"
              }
            ],
            "icon": "fa-facebook",
            "enableRelatedArticles": false,
            "imageoptions": {
              "crops": {
                "16:9": [16, 9],
                "1:1": [1, 1],
                "4:3": [4, 3],
                "8:5": [8, 5]
              },
              "imageinfo": true,
              "softcrop": true
            }
          }
        ]
      }
    }
  ]
}
```

### Basic Options

| Property                                  | Type      | Required  | Description   |
| --------                                  | :--:      | :------:  | -----------   |
| **teaserPosition**                        | String    | `false`   | Sets render position for teaser container. `"top"` or `"bottom"`. Default value: `"bottom"` |
| **disableUseOfAnnotationToolsForFields**  | Array     | `false`   | Disabled annotation for fields by id. |
| **types**                                 | Array     | `true`    | Description of enabled types |

### Types Options
Types Configuration Example:

```javascript
{
    "type": "x-im/teaser",
    "label": "Teaser",
    "icon": "fa-newspaper-o",
    "enableRelatedArticles": false,
    "imageoptions": { ... },
    "fields": [ ... ]
}
```


| Property                      | Type      | Required  | Description   |
| --------                      | :--:      | :------:  | -----------   |
| **type**                      | String    | `true`    | Datatype of teaser which is rendered in the XML as `<object type="[type]">`, e.g `<object type="x-im/teaser">`. |
| **label**                     | String    | `true`    | Descriptive label for Type, displayed in tab menu. |
| **icon**                      | String    | `true`    | Icon used in tab menu, uses [FontAwesome icons](http://fontawesome.io/icons/). e.g `"fa-twitter"`. |
| **enableRelatedArticles**     | Boolean   | `false`   | Set to `true` to enable adding related articles to teaser. Defaults to `false`. |
| **imageoptions**              | Object    | `true`    | Describes image options for type. See [Image Options Configuration](#image-options-configuration) |
| **fields**                    | Array     | `true`    | Description of enabled input fields. To disable a specific field, remove it from this array. See [Fields Options Configuration](#fields-options-configuration) |

### Image Options Configuration
Image Options Configuration Example:
```json
{
    "imageinfo": true,
    "softcrop": true,
    "crops": {
        "16:9": [16, 9],
        "4:3": [4, 3],
        "1:1": [1, 1]
    }
}
```

| Property      | Type      | Required  | Description   |
| --------      | :--:      | :------:  | -----------   |
| **imageinfo** | Boolean   | `false`   | Per default the image can open a dialog with meta data stored on the actual image. This can be disabled by setting `imageinfo` to `false`. |
| **softcrop**  | Boolean   | `false`   | The soft crop dialog is hidden by default. Set `softcrop` to `true` to enable. |
| **crops**     | Array     | `false*`  | *Required if soft crop dialog is enabled.<br>Expressed as an object of named ratios. The value for each named dimension is an array of the width and height ratio. |

### Fields Options Configuration
Field Configuration Example:
```json
[
    {
        "id": "subject",
        "label": "Subject",
        "icon": "fa-flag"
    },
    {
        "id": "title",
        "label": "Title",
        "icon": "fa-header"
    },
    {
        "id": "text",
        "label": "Text",
        "icon": "fa-paragraph",
        "multiline": true
    },
    {
        "id": "tag",
        "label": "Tag",
        "icon": "fa-tag"
    },
    {
        "id": "teaserEndDate",
        "label": "End date",
        "icon": "fa-calendar",
        "type": "datetime"
    }
]
```

| Property       | Type      | Required  | Description   |
| --------       | :--:      | :------:  | -----------   |
| **id**         | String    | `true`    | subject, title, or text (any other string will result in a custom field) |
| **label**      | String    | `true`    | Placeholder for field |
| **icon**       | String    | `false`   | Sets icon used for field. Default value is `"fa-header"` Uses [FontAwesome icons](http://fontawesome.io/icons/). e.g `"fa-twitter"`. |
| **multiline*** | Boolean   | `false`   | **Only available for field with id `text`** Set to `true` to enable multiline text editing. Default value is `false` |
| **type***      | String    | `false`   |  **Only available on custom fields** Choose the type of input to use for the field. One of `"text"`, `"datetime"`, `"date"`, `"time"`. Default: `"text"`|

**\*Warning** Enabling multiline editing will change the output of `data > text`-element.

### Outout Difference Between Multiline and Simple Text
When `multiline` is enabled, the xml-output of the `text`-field changes when the article is saved.

**Multiline Enabled**
```xml
<text format="idf">
    <element id="paragraph-88beb76cb6af9ca39303bebc20497c56" type="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</element>
    <element id="paragraph-360f09442467b39801c6f60971b9c02c" type="body">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</element>
    <element id="paragraph-337d42c0a735a1faab645382bbf39fff" type="body">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</element>
</text>
```

**Multiline Disabled**
```xml
<text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</text>
```

### Custom Fields
When setting the `id` of a field to anything other than `"subject"`, `"title"`, or `"text"`, a custom field will be created which enables adding arbitrary data to the teaser. When using a custom field, the `type` attribute will decide what kind of data the field will support.

| Type     | Output format        | Output example            | Input element                         |
|----------|----------------------|---------------------------|---------------------------------------|
| text     | -                    | Lorem ipsum               | Field editor                          |
| datetime | YYYY-MM-DDTHH:mm:ssZ | 2017-01-30T12:00:00+01:00 | Datetime field editor set to datetime |
| date     | YYYY-MM-DD           | 2017-01-30                | Datetime field editor set to date     |
| time     | HH:mm:ss             | 12:00:00                  | Datetime field editor set to time     |

Custom fields will be saved under the `data` element.

```xml
<object id="NjMsMTExLDIzMSwxNzE" type="x-im/custom-teaser" title="Lorem ipsum">
    <data>
        <text>Lorem ipsum dolor sit amet<text>
        <customFieldOne>2017-01-30T12:00:00+01:00</customFieldOne>
    </data>
</object>
```

## Basic Configuration Example
This is a config example for basic teaser support.

```json
{
    "id": "se.infomaker.ximteaser",
    "name": "ximteaser",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximteaser.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximteaser.css",
    "mandatory": false,
    "enabled": true,
    "data": {
        "teaserPosition": "top",
        "disableUseOfAnnotationToolsForFields": [
            "title"
        ],
        "types": [
            {
                "type": "x-im/teaser",
                "label": "Teaser",
                "icon": "fa-newspaper-o",
                "imageoptions": {
                    "softcrop": true,
                    "imageinfo": true,
                    "crops": {
                        "16:9": [16, 9],
                        "8:5": [8, 5],
                        "4:3": [4, 3],
                        "1:1": [1, 1]
                    }
                },
                "fields": [
                    {
                        "id": "subject",
                        "label": "Subject",
                        "icon": "fa-flag"
                    },
                    {
                        "id": "title",
                        "label": "Rubrik",
                        "icon": "fa-header"
                    },
                    {
                        "id": "text",
                        "label": "Text",
                        "icon": "fa-paragraph"
                    }
                ]
            }
        ]
    }
}
```

## Extending Teaser Image Upload
`ExtendingComponentClass` renders in a dialog when clicking upload image button.

Register your own plugin from the PluginPackage.js to extend Teaser Component:
```
config.addPluginModule(
    'se.infomaker.ximteaser.upload-extension',
    ExtendingComponentClass,
    'se.infomaker.ximteaser'
)
```

Make sure your ExtendingComponentClass contains the `onClose`-method in order to
enable dialog functionality.

ExtendingComponentClass receives props to add image to teaser:
```javascript
{
    pluginNode: <TeaserNode>,       // The active Teaser Node
    insertImageCommand: <String>    // Name of Command used to insert image in the teaser
}
```

### Using insertImageCommand
In your own plugin, use the `insertImageCommand` to send an image back to the teaser like this:

```javascript
editorSession.executeCommand(this.props.insertImageCommand, {
    data: {
        type: 'url',
        url: 'https://i.imgur.com/1UuFlnf.jpg'
    },
    context: {node: this.props.pluginNode} // This tells the command to insert image on the active TeaserNode
})
```

### Using insertImageCommand with Existing Transaction
If your plugin needs to send an image back to the teaser during a transaction, i.e handling a drop
event, that transaction needs to be supplied to `insertImageCommand` via params, like this:

```javascript
editorSession.executeCommand(this.props.insertImageCommand, {
    tx: tx,
    data: { ... },
    context: {node: this.props.pluginNode}
})
```

`insertImageCommand` can handle images with types file, uri, node, and url.
Depending on the `data`-object the command handles the image insert differently.

### Insert File
Send single file to `insertImageCommand`. Useful for file drag och upload.
```javascript
data = {
    type: 'file',
    file: <File>
}
```

### Insert Url
Send url for image to `insertImageCommand`.
```javascript
data = {
    type: 'url',
    url: <String>
}
```

### Insert ImageNode
Send single nodeId of ImageNode to `insertImageCommand`.
```javascript
data = {
    type: 'node',
    nodeId: <String>
}
```

### Insert Uri
Send uri-data with image information to `insertImageCommand`.
```javascript
data = {
    type: 'uri',
    uri: <String>,
    uriData: <Object>
}
```
