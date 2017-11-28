# History plugin
Plugin handles saving local versions of articles and possibility to open an unsaved local copy of an article in
the Writer.

To restore a text the user clicks the history icon, after which a list of local
backups of articles is presented. When clicking on an article, a time line of
article versions is displayed, together with a preview component showing the
content for a selected version.

## Plugin configuration
No `data` configuration needed.

```json
{
  "plugins": [
    {
      "id": "se.infomaker.history",
      "name": "history",
      "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-history.js",
      "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-history.css",
      "enabled": true,
      "mandatory": false
    }
  ]
}
```

## Output
None.