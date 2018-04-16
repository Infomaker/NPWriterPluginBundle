# Image Plugin
This plugin is responsible for handling images for an article. This includes drop of images onto the article, either
from disk or from URL.

## Dependency
`Writer version >=4.4.0`

## Plugin configuration

The image plugin configuration must have several things defined to work correctly.
```json
{
    "id": "se.infomaker.ximimage",
    "name": "ximimage",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximimage.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximimage.css",
    "mandatory": false,
    "enabled": true,
    "data": {
        "imageFileExtension": [".jpg", ".jpeg", ".png", ".gif"],
        "softcrop": true, // Default false
        "bylinesearch": false, // Default true
        "byline": false, // Default true
        "imageinfo": false, // Default true
        "crops": { ... },
        "fields": [ ... ],
        "cropInstructions": { ... },
        "propertyMap": { ... }
    }
}
```

### Basic options

#### Image file extensions
*Optional* Defines the file extensions that should trigger this plugin when a URL is dropped.
Set `imageFileExtension` to an array of valid extensions, [".jpg", ".jpeg", ".png", ".gif"] is the default value if unset.

#### Soft crop
*Optional* The soft crop dialog is hidden by default. Set `softcrop`
to `true` to enable.

*The setting `enablesoftcrop` is deprecated!*

#### Byline search
*Optional* Per default the image plugin tries to search for photographers in
the backend. This can be disabled by setting `bylinesearch` to `false`.

#### Disable byline
*Optional* Per default the image can add and remove authors/photographers.
This can be disabled by setting `byline` to `false`.

#### Image archive information
*Optional* Per default the image can open a dialog with meta data stored on
the actual image. This can be disabled by setting `imageinfo` to `false`.

#### Crop definitions
*Optional* Mandatory if soft crop dialog is enabled. Expressed as an object
of named ratios. The value for each named dimension is an array of the
width and height ratio.

```json
"crops": {
    "16:9": [16, 9],
    "4:3": [4, 3],
    "square": [1, 1]
}
```

#### Crop instructions

Crop instructions define the query part for an image service.
There are two entries that need to be defined, `auto` and `userDefined`.

The `auto` entry specifies parameters that is used when automatic cropping
is done on images.

The `userDefined` entry specifies parameters for when the user has defined
how the crops should look.

For each entry `auto` and `userDefined`, it is possible to specify different
parameters for each ratio defined in the `crops` section. This is done
by specifying the crop key as key. The 'default' ratio is being used if no
crop parameters are specified for a given ratio.

In order to construct a URL, template variables may be used. Then are defined
as `{{variableName}}`. These variables currently exists:

| Variable name | Description |
| ------------: | :---------- |
| w             | The image width |
| h             | The image height |
| cx            | The start of crop in x direction, defined in pixels |
| cy            | The start of crop in y direction, defined in pixels |
| cw            | The width of the crop, defined in pixels |
| ch            | The height of the crop, defined in pixels |
| cxrel         | The start of crop in x direction, defined as a relative number from 0-1 |
| cyrel         | The start of crop in y direction, defined as a relative number from 0-1 |
| cwrel         | The width of the crop , defined as a relative number from 0-1 |
| chrel         | The height of the crop , defined as a relative number from 0-1 |
| uuid          | The uuid of the image metadata file |


Example:
```json
"cropInstructions": {
    "auto": {
        "default": "fit=crop&crop=faces,edges&w={{w}}&h={{h}}"
    },
    "userDefined": {
        "default": "rect={{cx}},{{cy}},{{cw}},{{ch}}&fit=crop&w={{w}}&h={{h}}"
    }
}
```

#### Fields configuration
Per default the image plugin only have a byline field in the article. In
addition there are a number of different fields that can be turned on:
`caption` (expressed as the field `text` in the NewsML for historic reasons),
`alttext`, `credit` and `alignment`. These fields can either be text or
option fields. Option fields have fixed set of values defined. Below is an
example where all the fields are enabled and configured.

```json
"fields": [
    {
        "name": "caption",
        "label": "Caption",
        "type": "text"
    },
    {
        "name": "alttext",
        "label": "Alt text",
        "type": "text"
    },
    {
        "name": "credit",
        "label": "Credit",
        "type": "text"
    },
    {
        "name": "alignment",
        "label": "Alignment",
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
```

#### Property Map
*Optional* When an image is added to the Writer surface, the writer will fetch that image's metadata and fill the image node's
properties automatically.
It is possible to configure which metadata fields from the image's newsitem maps to the ximimage node properties.

Mapping of an Image Node property can be disabled by setting its mapped value to `false`.

##### Standard Mapping
If not present, these are the default mappings for an Image Node's properties.

| Image Node Property | Image Meta Property |
| ------------------: | :------------------ |
| authors             | `"authors"`             |
| credit              | `"credit"`              |
| caption             | `"caption"`             |
| alttext             | `false`               |

##### Allowed Property Values
If an Image Node property is mapped to `false` it will not receive any value.

**If the configuration is invalid, the image will use the standard
mapping.**

| Image Node Property | Allowed Properties           |
| ------------------: | :--------------------------- |
| authors             | `"authors", false`           |
| credit              | `"caption", "credit", false` |
| caption             | `"caption", "credit", false` |
| alttext             | `"caption", "credit", false` |

##### Property Mapping Examples

**Map caption to alttext**
Disable caption mapping and map caption to image node's alttext.
```json
"propertyMap": {
    "caption": false,
    "alttext": "caption"
}
```

**Disable all metadata mapping**
Completely disabled meta-data-mapping to added images.
```json
"propertyMap": {
    "authors": false,
    "credit": false,
    "caption": false,
    "alttext": false
}
```

## Image plugin contract between plugin and the backend
### Routes
Image Plugin routes it's requests via Editor Service (aka Writer Backend). This means that if
a different format than NewsML is used in the repository, the Transformer service needs to be able
to handle the mapping between NewsML (NewsItem of type "picture") and repository native format.

Further more, the Repository Gateway must be able to handle GET, PUT and POST request regarding
image metadata entities.

## Output
Whe dropping an image onto the article, the plugin will create a NewsItem to represent the metadata
object for the uploaded image. The plugin also reads the NewsItem for any image existing in the article.

The NewsItem format for the image is described on [GitHub](https://github.com/Infomaker/writer-format/blob/master/newsml/newsitem/newsitem-picture.xml).

In the article, a relation to an image is described as an `object` element as a child of `newsItem > contentSet > inlineXML > idf > object`
element. The format of the `object` is:

```xml
<object id="MjEyLDE5NCw0NiwxMTA" type="x-im/image" uuid="3314b6ed-ec82-5924-9de1-8b0cb2a39cc2">
    <links>
        <link rel="self" type="x-im/image" uri="im://image/IdJjMZVdi0afHsmQRurNl07J-00.jpeg"
            uuid="3314b6ed-ec82-5924-9de1-8b0cb2a39cc2">
            <data>
                <text>This is an image description that will be stored on the article</text>
                <width>800</width>
                <height>600</height>
                <!-- OPTIONAL -->
                <credit>Nyhetsbyrån</credit>
                <alttext>Image description</alttext>
                <alignment>left</alignment>
                <links>
                    <link title="16:9" rel="crop" type="x-im/crop" uri="im://crop/0.35/0/0.39/0.32755298651252407"/>
                    <link title="8:5" rel="crop" type="x-im/crop" uri="im://crop/0/0.019267822736030827/1/0.9633911368015414"/>
                    <link title="4:3" rel="crop" type="x-im/crop" uri="im://crop/0.0675/0/0.865/1"/>
                    <link title="1:1" rel="crop" type="x-im/crop" uri="im://crop/0.17625/0/0.64875/1"/>
                    <link rel="author" title="John Doe" uuid="00000000-0000-0000-0000-000000000000" type="x-im/author"/>
                    <link rel="author" uuid="7a39b42b-1315-4711-a136-7b3a9f132110" title="Jane Doe" type="x-im/author">
                        <data>
                            <email>jane.doe@email.com</email>
                        </data>
                    </link>
                </links>
            </data>
        </link>
    </links>
</object>
```
Sub elements to `data` can be, depending on how the plugin is configured;

* `caption`
* `alttext`
* `credit`
* `alignment`
