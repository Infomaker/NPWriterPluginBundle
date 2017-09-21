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
```json
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

#### teaserPosition
Optional, String. Sets render position for teaser container. `"top"` or `"bottom"`.   
Default value: `"bottom"`

#### disableUseOfAnnotationToolsForFields
Optional, Array. Disabled annotation for fields by id.

#### types
**Required**, Array.

### Types Options

#### type
**Required**, String. Datatype of teaser which is rendered in the XML as
`<object type="[type]">`, e.g `<object type="x-im/teaser">`.

#### label
**Required**, String. Descriptive label for Type, displayed in tab menu.

#### icon
**Required**, String. Icon used in tab menu, uses
[FontAwesome icons](http://fontawesome.io/icons/). e.g `"fa-twitter"`.

#### imageoptions
**Required**, Object.

### Image Options Configuration
Image Options Configuration Example:
```json
{
    "imageinfo": true,
    "softcrop": true,
    "crops": {
        "16:9": [16, 9],
        "8:5": [8, 5],
        "4:3": [4, 3],
        "1:1": [1, 1]
    }
}
```

#### imageinfo
*Optional*, Bool. Per default the image can open a dialog with meta data
stored on the actual image. This can be disabled by setting `imageinfo`
to `false`.

#### softcrop
*Optional*, Bool. The soft crop dialog is hidden by default. Set
`softcrop` to `true` to enable.

#### crops
*Optional*, Array. Mandatory if soft crop dialog is enabled. Expressed
as an object of named ratios. The value for each named dimension is
an array of the width and height ratio.

#### fields
**Required**, Array.

### Fields Options Configuration
Types Configuration Example:
```json
[
    {
        "id": "subject",
        "placeholder": "Subject",
        "icon": "fa-flag"
    },
    {
        "id": "title",
        "placeholder": "Title",
        "icon": "fa-header"
    },
    {
        "id": "text",
        "placeholder": "Text",
        "icon": "fa-paragraph"
    }
]
```

#### id
"subject,title,text"

#### placeholder
"Subject"

#### icon
"fa-flag"

## Extending Teaser Image Upload

ComponentClass renders in a dialog when clicking upload image button.

Register your own plugin from the PluginPackage.js to extend Teaser Component:
```
config.addPluginModule(
    'se.infomaker.ximteaser2.upload-extension',
    ComponentClass,
    'se.infomaker.ximteaser2'
)
```

Make sure your ComponentClass contains the `onClose`-method in order to
enable dialog functionality.

ComponentClass receives props to add image to teaser:
```javascript
{
    pluginNode: <TeaserNode>, // The active Teaser Node
    insertImageCommand: <String> // Name of Command used to insert image in the teaser
}
```

In your own plugin, use the `insertImageCommand` to send an image back to the teaser like this:

```javascript
editorSession.executeCommand(this.props.insertImageCommand, {
    data: {
        type: 'url',
        url: 'https://i.imgur.com/1UuFlnf.jpg'
    },
    context: {node: this.props.pluginNode}
})
```

If your plugin needs to send an image back to the teaser during a transaction, i.e handling a drop
event, that transaction needs to be supplied to `insertImageCommand` like this:

```javascript
editorSession.executeCommand(this.props.insertImageCommand, {
    tx: tx,
    data: { ... },
    context: {node: this.props.pluginNode}
})
```

`insertImageCommand` can handle images types file, uri, node, and url.
Depending on the `data`-object the command handles the insert differently.

### Insert File
Send single file to `insertImageCommand`.
```javascript
{
    type: 'file',
    file: <File>
}
```

### Insert Uri
Send uri-data with image information to `insertImageCommand`.
```javascript
{
    type: 'uri',
    uriData: <Object>
}
```

### Insert ImageNode
Send single nodeId of ImageNode to `insertImageCommand`.
```javascript
{
    type: 'node',
    nodeId: <String>
}
```

### Insert Url
Send url for image to `insertImageCommand`.
```javascript
{
    type: 'url',
    url: <String>
}
```
