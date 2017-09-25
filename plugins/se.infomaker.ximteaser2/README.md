# Multi Teaser Plugin
This plugin handles teaser content for multiple types. Types depend on
the plugin configuration (see below).

Each teaser type has configurable data-type, content fields, and image options.

## NewsItem Format
The plugin adds one or more objects to the metadata-section of the idf.

```xml
<metadata xmlns="http://www.infomaker.se/newsml/1.0">
    <object id="MjE5LDE2MywyNDgsMjA4" type="x-im/teaser" title="Lorem ipsum">
        <data>
            <text>Mauris at libero condimentum sapien malesuada efficitur non id nibh.</text>
            <subject>Lorem ipsum dolor sit amet, consectetur adipiscing elit</subject>
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
        </links>
    </object>
    <object id="NjMsMTExLDIzMSwxNzE" type="x-im/facebook-teaser" title="Lorem ipsum">
        <data>
            <text>Mauris at libero condimentum sapien malesuada efficitur non id nibh.</text>
        </data>
    </object>
    <object id="PkEs6SJgLeQ0FS1qMjk" type="x-im/twitter-teaser" title="Lorem ipsum">
        <data>
            <text>Mauris at libero condimentum sapien malesuada efficitur non id nibh.</text>
        </data>
    </object>
</metadata>
```

*Note* that `object > links` is optional, i.e. if no images are present
this element is omitted.

## Plugin Configuration Example
```javascript
{
    "id": "se.infomaker.ximteaser2",
    "name": "ximteaser",
    "url": "http://localhost:5001/im-ximteaser2.js",
    "style": "http://localhost:5001/im-ximteaser2.css",
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
                "imageoptions": { ... },
                "fields": [ ... ]
            },
            {
                "type": "x-im/facebook-teaser",
                "label": "Facebook",
                "icon": "fa-facebook",
                "imageoptions": { ... },
                "fields": [ ... ]
            },
            {
                "type": "x-im/twitter-teaser",
                "label": "Twitter",
                "icon": "fa-twitter",
                "imageoptions": { ... },
                "fields": [ ... ]
            }
        ]
    }
}
```

### Basic Options

| Property                                  | Type      | Required  | Description   |
| --------                                  | :--:      | :------:  | -----------   |
| **teaserPosition**                        | Boolean   | `false`   | Sets render position for teaser container. `"top"` or `"bottom"`. Default value: `"bottom"` |
| **disableUseOfAnnotationToolsForFields**  | Array     | `false`   | Disabled annotation for fields by id. |
| **types**                                 | Array     | `true`    | Description of enabled types |

### Types Options
Types Configuration Example:

```javascript
{
    "type": "x-im/teaser",
    "label": "Teaser",
    "icon": "fa-newspaper-o",
    "imageoptions": { ... },
    "fields": [ ... ]
}
```


| Property          | Type      | Required  | Description   |
| --------          | :--:      | :------:  | -----------   |
| **type**          | String    | `true`    | Datatype of teaser which is rendered in the XML as `<object type="[type]">`, e.g `<object type="x-im/teaser">`. |
| **label**         | String    | `true`    | Descriptive label for Type, displayed in tab menu. |
| **icon**          | String    | `true`    | Icon used in tab menu, uses [FontAwesome icons](http://fontawesome.io/icons/). e.g `"fa-twitter"`. |
| **imageoptions**  | Object    | `true`    | Describes image options for type. See [Image Options Configuration](#image-options-configuration) |
| **fields**        | Array     | `true`    | Description of enabled input fields. See [Fields Options Configuration](#fields-options-configuration) |

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
| **crops**     | Array     | `false*`  |   *Mandatory if soft crop dialog is enabled.<br>Expressed as an object of named ratios. The value for each named dimension is an array of the width and height ratio. |

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
        "icon": "fa-paragraph"
    }
]
```

| Property  | Type      | Required  | Description   |
| --------  | :--:      | :------:  | -----------   |
| **id**    | String    | `true`    | subject, title, or text |
| **label** | String    | `true`    | Description of enabled fields |
| **icon**  | String    | `false`   | Sets icon used for field. Default value is `"fa-header"` Uses [FontAwesome icons](http://fontawesome.io/icons/). e.g `"fa-twitter"`. |

## Extending Teaser Image Upload
`ExtendingComponentClass` renders in a dialog when clicking upload image button.

Register your own plugin from the PluginPackage.js to extend Teaser Component:
```
config.addPluginModule(
    'se.infomaker.ximteaser2.upload-extension',
    ExtendingComponentClass,
    'se.infomaker.ximteaser2'
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
