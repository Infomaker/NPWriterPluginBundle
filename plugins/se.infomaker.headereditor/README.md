# Header editor plugin
This plugin handles "headers" so that they are separated from other content.

## Plugin configuration
```json
{"data": {"elements": [
    "headline",
    "leadin"
]}}
```
In the configuration you specify which paragraph styles that should be handled as "headers".

## Output
In the article, the plugin will add the following xml block under `newsItem > contentSet > inlineXML > idf`:
```xml
<group xmlns="" id="metadata" type="header">
    <element type="headline">Headline here</element>
    <element type="leadin">Leadin here</element>
</group>
```