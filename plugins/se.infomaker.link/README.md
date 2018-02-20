# Link plugin

Default plugin for adding links in text content.

## Plugin configuration

```json
{
    "id": "se.infomaker.link",
    "name": "link",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-link.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-link.css",
    "enabled": true,
    "mandatory": false
}
```

No `data` configuration needed.

## Output

A link is found inline in the content text element.

```xml
    <element id="paragraph-12cdd9b8d3fbf01a544e30b11751eef5" type="body">Body text with a <a id="link-3d954f43b950f4b1704ba3e565e8467e" href="https://www.google.com">link to Google</a>.</element> ```
