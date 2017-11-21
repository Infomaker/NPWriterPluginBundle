# Editorial note plugin
Plugin for adding editing editorial note in a news item metadata

## Plugin configuration
No data configuration needed.
```json
{
  "plugins": [
    {
      "id": "se.infomaker.editorialnote",
      "name": "editorialnote",
      "url": "https://plugins.writer.infomaker.io/releases/4.0.0/im-editorialnote.js",
      "style": "https://plugins.writer.infomaker.io/releases/4.0.0/im-editorialnote.css",
      "enabled": true,
      "mandatory": false
    }
  ]
}
```

## Output
In the article, the plugin will add, set or remove edNote element under `newsItem > itemMeta`:
```xml
<edNote>Duis eget magna lacus. In sodales lectus vel egestas rhoncus.</edNote>
```
