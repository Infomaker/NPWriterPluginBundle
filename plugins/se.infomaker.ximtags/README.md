# ximtags plugin
This plugin handles searching, creating and editing "tags". What is handled by the plugin depends on the plugin
configuration (see below).

## Plugin configuration
```json
{
    "id": "se.infomaker.ximtags",
    "name": "ximtags",
    "url": "http://localhost:5001/index.js",
    "style": "http://localhost:5001/style.css",
    "mandatory": false,
    "enabled": true,
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

## Tag concept format
See [Concept Items](https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem).

## Tag format in article
When applying a tag in the article the relation will be represented as a link;
```xml
<newsItem>
    <itemMeta>
        <links>
            <link title="Volvo" rel="author" type="x-im/organisation" uuid="4w1653f3-6575-5cb7-8b74-qc4dea63513e"/>                
        </links>
    </itemMeta>
</newsItem>
```