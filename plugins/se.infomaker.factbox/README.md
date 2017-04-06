# Inline text plugin
TODO: migrate to InlineText plugin...

## NewsItem format
The plugin adds an object to the idf.

```xml
<object id="MTUwLDE4Miw1NCwxMjc" type="x-cmbr/fact" title="Lorem ipsum">
    <data>
        <subject>Lorem ipsum dolor sit amet, consectetur adipiscing elit</subject>
        <text format="html"><![CDATA[<p>Mauris at libero condimentum sapien malesuada efficitur non id nibh.</p>]]></text>
    </data>
    <links>
        <link uri="im://inline-text/fact" rel="inline-text"/>
    </links>
</object>
```
*Note* that `object > links` is optional, i.e. if no inline-text uri:s are configured (see Plugin configuration below) 
this element is omitted.

## Configuration
```json 
{
    "id": "se.infomaker.factbox",
    "name": "factbox",
    "url": "http://localhost:5001/index.js",
    "enabled": true,
    "mandatory": true,
    "data": {
        "type": "x-cmbr/fact",
        "disableUseOfAnnotationToolsForFields": [
            "title",
            "vignette"
        ],
        "standaloneDefault": "Fakta",
        "inlineTexts": [
            {
                "uri": "im://inline-text/fact",
                "name": "Faktaruta"
            },
            {
                "uri": "im://inline-text/factbox",
                "name": "Faktabox",
                "default": true
            },
            {
                "uri": "im://inline-text/stick",
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
 
If `inlineTexts` is optional. If omitted no dropdown will be displayed, instead value of `standaloneDefault` is 
displayed.