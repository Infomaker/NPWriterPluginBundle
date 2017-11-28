# ximtags plugin
This plugin handles searching and selecting "tags" for an article. These tags are `Concepts` which
are documented here: https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem.

The plugin allows a user to create new and edit existing tags depending on the plugin configuration (see below).

## Plugin configuration
```json
{    
    "data": {"tags": {
        "x-im/person": {
            "icon": "fa-user",
            "name": "Person",
            "editable": true
        },
        "x-im/organisation": {
            "icon": "fa-sitemap",
            "name": "Organisation",
            "editable": true
        },
        "x-im/topic": {
            "icon": "fa-tags",
            "name": "Topic",
            "editable": true
        }
    }}
}
```

The `tags` config decides what types of concepts that are handled by the plugin.

Please note that `tags` must correspond with Concept backend configuration for `tags` search so that the same
concept types are used both in plugin and in Concept backend.

If editable is true, the tag may be created and updated. If false, the tag is not possible to create and just the information about
the tag is shown when clicking on an existing tag.

## Output
When applying a tag in the article the relation will be represented as a link under `newsItem > itemMeta > links`;
```xml
<link title="Volvo" rel="author" type="x-im/organisation" uuid="4w1653f3-6575-5cb7-8b74-qc4dea63513e"/>                      
```