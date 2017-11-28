# Header editor plugin
This plugin handles "header" fields so that they are separated from body content.

## Plugin configuration
```json
{
  "id": "se.infomaker.headereditor",
  "name": "headereditor",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-headereditor.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-headereditor.css",
  "mandatory": false,
  "enabled": true,
  "data": {
  "elements": [
    "headline",
    "leadin"
    ]
  }
}
```
In the configuration you specify which paragraph styles that should be handled as "headers".

### Plugin activation

The article (and template article) must contain the header group with the elements specified in the plugin config in order for the
fields to be visible in the editor.

## Output
The plugin is responsible for the header group in the article, in the following xml block under `newsItem > contentSet > inlineXML > idf`:
```xml
<group xmlns="" id="metadata" type="header">
    <element type="headline">Headline here</element>
    <element type="leadin">Leadin here</element>
</group>
```