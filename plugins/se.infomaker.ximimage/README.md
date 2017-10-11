# Image Plugin
Documentation of the image plugin.

## Image plugin configuration

The image plugin configuration must have several things defined to work correctly.
```json
{
    "vendor": "infomaker.se",
    "name": "ximimage",
    "enabled": true,
    "data": {
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

### Format
Image Plugin expects a NewsItem of type "picture" to represent an images metadata. This means that
backend must be able to read and serve image metadata in the format specified below.

```xml
<newsItem xmlns="http://iptc.org/std/nar/2006-10-01/" conformance="power"
    guid="3314b6ed-ec82-5924-9de1-8b0cb2a39cc2" standard="NewsML-G2" standardversion="2.20"
    version="1">
    <catalogRef href="http://www.iptc.org/std/catalog/catalog.IPTC-G2-Standards_27.xml"/>
    <catalogRef href="http://infomaker.se/spec/catalog/catalog.infomaker.g2.1_0.xml"/>
    <itemMeta>
        <itemClass qcode="ninat:picture"/>
        <versionCreated>2016-09-13T10:44:08Z</versionCreated>
        <firstCreated>2016-09-12T11:12:29Z</firstCreated>
        <!-- OPTIONAL -->
        <provider>Infomaker</provider>
        <pubStatus qcode="stat:usable"/>
        <itemMetaExtProperty type="imext:type" value="x-im/image"/>
        <itemMetaExtProperty type="imext:uri" value="im://image/IdJjMZVdi0afHsmQRurNl07J-00.jpeg"/>
        <!-- OPTIONAL -->
        <itemMetaExtProperty type="imext:originalUrl"
            value="https://writer-internal-images-test.s3.amazonaws.com/IdJjMZVdi0afHsmQRurNl07J-00.jpeg"/>
        <fileName>IdJjMZVdi0afHsmQRurNl07J-00.jpeg</fileName>
        <!-- OPTIONAL -->
        <links xmlns="http://www.infomaker.se/newsml/1.0">
            <link rel="author" title="John Doe" uuid="00000000-0000-0000-0000-000000000000"/>
            <link rel="author" title="Jane Doe" uuid="00000000-0000-0000-0000-000000000000"/>
        </links>
    </itemMeta>
    <contentMeta>
        <contentCreated>2016-09-12T11:12:29Z</contentCreated>
        <contentModified>2016-09-13T10:44:08Z</contentModified>
        <metadata xmlns="http://www.infomaker.se/newsml/1.0">
            <object id="81RYdD9214Z2" type="x-im/image">
                <data>
                    <!-- OPTIONAL -->
                    <width>800</width>
                    <!-- OPTIONAL -->
                    <height>600</height>
                    <!-- OPTIONAL -->
                    <text>This is the description of the image...</text>
                    <!-- OPTIONAL -->
                    <credit>Credit here...</credit>
                    <!-- OPTIONAL -->
                    <photoDateTime>2015-12-31T22:58:00+01:00</photoDateTime>
                    <!-- OPTIONAL -->
                    <objectName>Object name here...</objectName>
                    <!-- OPTIONAL -->
                    <source>Source here...</source>
                    <!-- OPTIONAL -->
                    <instructions>Instructions here...</instructions>
                </data>
            </object>
        </metadata>
    </contentMeta>
</newsItem>
```
### Format explained
All elements in the format above are mandatory if not stated otherwise below.

The `guid` attribute of `newsItem` corresponds to the id of the image metadata entity in repository,
i.e. it does not have to be a "true" guid.

#### ItemClass
```
<itemClass qcode="ninat:picture"/>
```
Indicates that the NewsItem is a picture.    

#### Created and modified timestamps

```
<firstCreated>2016-09-12T11:12:29Z</firstCreated>
<contentCreated>2016-09-12T11:12:29Z</contentCreated>
```
Corresponds to image entity's "created" timestamp.

```
<versionCreated>2016-09-13T10:44:08Z</versionCreated>
<contentModified>2016-09-13T10:44:08Z</contentModified>
```
Corresponds to image metadata entity's "modified" timestamp.

#### Provider
```
<provider/>
```
If the image has been uploaded from other place than Writer, `provider` can be used
to indicate this, e.g. `<provider literal="Other system name"/>`. Writer does not use this element
as-is.

#### Status
```
<pubStatus qcode="stat:usable"/>
```
Represent the status of the image. Writer supports two statuses, `stat:usable` which corresponds to
"published" and `imext:draft` which means that the image is not published yet.

#### Infomaker subtype

```
<itemMetaExtProperty type="imext:type" value="x-im/image"/>
```
Internal type indicating that the NewsItem is an image.

#### URI
```
<itemMetaExtProperty type="imext:uri" value="im://image/IdJjMZVdi0afHsmQRurNl07J-00.jpeg"/>
```
Represents the uri for the image. The uri should be constructed with prefix `im://image/` and then
the file name.

#### Original URL
```
<itemMetaExtProperty type="imext:originalUrl" value="https://writer-internal-images-test.s3.amazonaws.com/IdJjMZVdi0afHsmQRurNl07J-00.jpeg"/>
```
The original url to the image. When an image gets uploaded using the Writer this url will point
to the file in the "internal" S3 bucket.

#### File name
```
<fileName>IdJjMZVdi0afHsmQRurNl07J-00.jpeg</fileName>
```
File name of the image. Writer will create this file name hashing the binary and sha1.

#### Photographer(s)
```
<links xmlns="http://www.infomaker.se/newsml/1.0">
  <link rel="author" title="John Doe" uuid="00000000-0000-0000-0000-000000000000"/>
</links>
```
Each photographer or "author" is represented by a link. If author is not a "real"
author (i.e. exists as a user in repository) `uuid` should be in the format described in example
above, otherwise an actual id to the user is expected. Corresponds to exif `xmp-dc:creator` and
`iptc:by-line`.

#### Exif metadata wrapper
```
<object id="81RYdD9214Z2" type="x-im/image">
```
This element wraps the majority of the metadata  attached to the image. The `id` attribute is an
identifier that should be unique within the  document. The `type` attribute should be `x-im/image`.

#### Dimensions
```
<width>1280</width>
<height>800</height>
```
Image width and height in pixels.

#### Image description
```
<text>This is the description of the image...</text>
```
The image description. Corresponds to exif `xmp-dc:description` and
`iptc:caption-abstract`.

#### Credit
```
<credit>Credit here...</credit>
```
Credit information for the image, e.g. "Scanpix". Corresponds to exif
`xmp-photoshop:credit` and `iptc:credit`. From iptc photo metadata specification;
_The Credit Line is a free-text field used by the supplier of the item to specify how the person(s)
and/or organisation(s) should be credited when the image is published._

#### Photo date
```
<photoDateTime>2015-12-31T22:58:00+01:00</photoDateTime>
```
The date when the photo was taken. Corresponds to exif `xmp-photoshop:datecreated`
 and `iptc:datecreated`. From iptc photo metadata specification;
_Use this field to record the date (and optionally, the time) the photograph was created, not the
 date when you scanned or edited the image._

#### Object name
```
<objectName>Object name here...</objectName>
```
The original file name for the image. Corresponds to exif `xmp-dc:title` and
`iptc:objectname`.

#### Source
```
<source>Source here</source>
```
Source for the image. Corresponds to exif `xmp-photoshop:source` and `iptc:source`.
From iptc photo metadata specification;
_The Source field should be used to identify the original owner or copyright holder of the
photograph._

#### Special instructions
```
<instructions>Instructions here...</instructions>
```
Any specific instructions attached to the image. Corresponds to exif
`xmp-photoshop:instructions` and `iptc:specialinstructions`.

### Relation in article
When an image is "added" to an article, the Image Plugin updates the article with the following to
represent the relation between article and image;

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
### Format explained
*NOTE* There are some duplicate information, `type="x-im/image"` and
`uuid="3314b6ed-ec82-5924-9de1-8b0cb2a39cc2"` is specified for both `<object...>` and
`<link...`. For mapping purpose, use the values specified for `<object...>`.

The `id` attribute of `object` is an identifier unique to the document. The `type` attribute is
`x-im/image` and `uuid` corresponds to the id the image metadata entity has in the repository.

The `link/@rel="self"` contains, apart from duplicate information regarding type and uuid, the
`uri` attribute of the image.

#### Image description
```
<data>
  <text>This is an image description that will be stored on the article</text>...
```
The image description used only for the image in current article.

#### Dimensions
```
<data>
  <width>200</width>
  <height>150</height>...
```
Dimensions of image.

#### Soft crop
```
<data>
  <crops rel="original">...
```
If soft crop is used in Image Plugin, data for this is stored here.

#### Photographer(s)
```
<links>
  <link rel="author" title="John Doe" uuid="00000000-0000-0000-0000-000000000000"/>
</links>
```
If needed it is possible to add photographer(s) ("author") of the image in the
relation to an image in the article. If the author is not a "real" user in the repository the
`uuid` should be in the format described in example above, otherwise it should be the repository
id of the user.
