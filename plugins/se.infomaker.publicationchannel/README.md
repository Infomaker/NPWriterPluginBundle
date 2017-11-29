# Publication channel plugin
Plugin for selecting one or more publication channels for the article.

## Plugin configuration

```json
{
  "id": "se.infomaker.publicationchannel",
  "name": "publicationchannel",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-publicationchannel.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-publicationchannel.css",
  "mandatory": false,
  "enabled": true,
  "data": {
    "useMainChannel": false,
    "publicationchannels": [
        {
            "qcode": "imchn:internal",
            "name": "internal.se",
            "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR",
            "iconInactive": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0i"
        },
        {
            "qcode": "imchn:demo",
            "name": "demo.se",
            "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg",
            "iconInactive": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc"
        }
    ]
  }
}
```

## Output
In the article, the plugin will add the following xml block under `newsItem > itemMeta`:
```xml
<service qcode="imchn:internal"/>
<service qcode="imchn:demo"/>
```
