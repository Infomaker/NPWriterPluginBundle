**DEPRECATED**: Use `se.infomaker.options` instead...

# Article Options plugin
This plugin is to enrich article with options that can be selected by the value of true or false. For example if an article is premium. 

## Plugin configuration
```json
{
  "id": "se.infomaker.articleoptions",
  "name": "articleoptions",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/index.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/style.css",
  "enabled": true,
  "mandatory": false,
  "data": {
    "options": {
      "premium": {
        "label": "Premium",
        "id": "premium",
        "type": "x-im/premium",
        "rel": "premium",
        "uri": "im://premium"
      },
      "facebook": {
        "label": "Facebook",
        "id": "facebook",
        "type": "x-im/facebook",
        "rel": "facebook",
        "uri": "im://facebook"
      }
    }
  }
}
```

## Options
Options describes what kind of article options you want to enrich your article with.

- label: Presented label in UI
- id: must be unique and is added to uri as value
- type: the of the link saved in XML
- rel: description of the link
- uri: saves the value