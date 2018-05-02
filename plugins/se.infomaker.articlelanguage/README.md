# Article Language Plugin

This plugin is used for setting language and which direction the text is read, right-to-left (rtl) or left-to-right (ltr).

## Dependencies

    // TODO: Update dependencies  

requires `writer => x.x.x`

## Plugin Configuration

```json
{
  "id": "se.infomaker.articlelanguage",
  "name": "im-articlelanguage",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-articlelanguage.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-articlelanguage.css",
  "mandatory": false,
  "enabled": true,
  "data": {
    "languages": [
        {
            "label": "Svenska",
            "code": "sv_SE"
        },
        {
            "label": "English",
            "code": "en_GB"
        },
        {
            "label": "Arabic (Egypt)",
            "code": "ar_EG",
            "direction": "rtl"
        }
    ]
  }
}
```

## Output

The plugin manipulates the idf-element to reflect the language 
of the content(`newsItem > contentSet > inlineXML > idf`).

```xml
<idf xmlns="http://www.infomaker.se/idf/1.0" xml:lang="sv-SE" dir="ltr">
  <!-- ... -->
</idf>
```
