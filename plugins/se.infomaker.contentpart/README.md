# Inline text plugin
TODO: migrate to InlineText plugin...

## Plugin configuration

```json
{
  "id": "se.infomaker.contentpart",
  "name": "contentpart",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-contentpart.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-contentpart.css",
  "enabled": true,
  "mandatory": true,
  "data": {
      "type": "x-im/content-part",
      "disableUseOfAnnotationTools": true,
      "contentpartTypes": [
          {
              "uri": "im://content-part/fact",
              "name": "Faktaruta",
              "displayTitle": false,
              "displaySubject": false,
          },
          {
              "uri": "im://content-part/factbox",
              "name": "Faktabox",
              "displayText": false,
              "default": true
          },
          {
              "uri": "im://content-part/stick",
              "name": "Sticka"
          }
      ],
      "placeholderText": {
          "title": "Rubrik",
          "vignette": "Fakta"
      }
  }
}
```

The `placeholderText` serves the placeholder text to be displayed in the input fields when field missing value.
 
At least one contentpartType should be specified.
 
At leaser one contentpartType should be marked as default.

## Output
The plugin adds an object to the idf (`newsItem > contentSet > inlineXML > idf > group`).

```xml
<object id="MTUwLDE4Miw1NCwxMjc" type="x-im/content-part" title="Lorem ipsum">
    <data>
        <subject>Lorem ipsum dolor sit amet, consectetur adipiscing elit</subject>
        <text format="html"><![CDATA[<p>Mauris at libero condimentum sapien malesuada efficitur non id nibh.</p>]]></text>
    </data>
    <links>
        <link uri="im://content-part/fact" rel="content-part"/>
    </links>
</object>
```
*Note* that `object > links` is optional, i.e. if no inline-text uri:s are configured (see Plugin configuration above) 
this element is omitted.