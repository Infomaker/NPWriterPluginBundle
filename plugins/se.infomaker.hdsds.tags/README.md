# Tag plugin
This plugin handles searching and selecting "tags".

## Plugin configuration
```
{
    "id": "se.infomaker.hdsds.tags",
    "name": "hdsdsmtags",
    "url": "http://localhost:5001/index.js",
    "style": "http://localhost:5001/style.css",
    "mandatory": false,
    "enabled": true,
    "data": {"filters": [
        "x-im/person",
        "x-im/organisation"
    ]}
}
```

The `filters` config decides what types of concepts that are handled by the plugin. If `filters` is not specified,
default filter is used;

```
[
    "x-im/person",
    "x-im/organisation",
    "x-cmbr/channel",
    "x-im/channel",
    "x-im/category"
]
```

Please note that `filters` must correspond with Concept backend configuration for `tags` search so that the same
filters are used both in plugin and in Concept backend.

## Tag concept format
See [Concept Items](https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem).

## Tag format in article
When applying a tag in the article the relation will be represented as a link;
```xml
<newsItem>
    <itemMeta>
        <links>
            <link title="John Doe" rel="author" type="x-im/author"
                uuid="9e1653f3-7575-4cb7-9b74-dc4dea63513e">
                <data>
                    <email>john.doe@example.org</email>
                </data>
            </link>
        </links>
    </itemMeta>
</newsItem>
```