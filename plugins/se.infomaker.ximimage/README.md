# Image Plugin
This plugin is responsible for handling images for an article. This includes drop of images onto the article, either
from disk or from URL.

## Plugin configuration

The image plugin configuration must have several things defined to work correctly.
```json
{
    "vendor": "infomaker.se",
    "name": "ximimage",
    "enabled": true,
    "data": {
        "imageFileExtension": [".jpg", ".jpeg", ".png", ".gif"],
        "softcrop": true, // Default false
        "bylinesearch": false, // Default true
        "byline": false, // Default true
        "imageinfo": false, // Default true
        "publishedmaxwidth": 2560,
        "crops": { ... },
        "urlMatchers": [ ... ],
        "fields": [ ... ],
        "cropInstructions": { ... }
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

||Variable name||Description||
|w|The image width|
|h|The image height|
|cx|The start of crop in x direction, defined in pixels|
|cy|The start of crop in y direction, defined in pixels|
|cw|The width of the crop, defined in pixels|
|ch|The height of the crop, defined in pixels|
|cxrel|The start of crop in x direction, defined as a relative number from 0-1|
|cyrel|The start of crop in y direction, defined as a relative number from 0-1|
|cwrel|The width of the crop , defined as a relative number from 0-1|
|chrel|The height of the crop , defined as a relative number from 0-1|
|uuid|The uuid of the image metadata file|

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

#### Url matchers
A mandatory array of patterns which tell the image plugin what kind of file
patterns to handle for drop etc.

```json
"urlMatchers": [
    "^.*\\.jpg",
    "^.*\\.gif",
    "^.*\\.png"
]
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
            <!--
                OPTIONAL. Note if softcrop feature in plugin is used this block is
                mandatory.
            -->
            <data>
                <text>This is an image description that will be stored on the article</text>
                <width>800</width>
                <height>600</height>
                <crops>
					<crop name="16:9">
						<x>0.32875</x>
						<y>0.5012406947890818</y>
						<width>0.2875</width>
						<height>0.3200992555831266</height>
					</crop>
					<crop name="4:3">
						<x>0.31</x>
						<y>0.5086848635235732</y>
						<width>0.32875</width>
						<height>0.48883374689826303</height>
					</crop>
					<crop name="1:1">
						<x>0.49</x>
						<y>0.533498759305211</y>
						<width>0.13</width>
						<height>0.25806451612903225</height>
					</crop>
				</crops>
            </data>
            <!-- OPTIONAL -->
            <links>
                <link rel="author" title="John Doe" uuid="00000000-0000-0000-0000-000000000000"/>
                <link rel="author" title="Jane Doe" uuid="00000000-0000-0000-0000-000000000000"/>
            </links>
        </link>
    </links>
</object>
```
Sub elements to `data` can be, depending on how the plugin is configured;

* `caption`
* `alttext`
* `credit`
* `alignment`