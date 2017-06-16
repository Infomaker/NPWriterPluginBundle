# Article type plugin

Plugin for give your article a type. Available article types are configured in the plugin (see below). The plugin 
supports choosing one or no article type for an article.

## Plugin configuration

```json
{
    "id": "se.infomaker.articletype",
    "name": "articletype",
    "url": "http://localhost:5001/im-articletype.js",
    "style": "http://localhost:5001/im-articletype.css",
    "enabled": true,
    "mandatory": false,
    "data": {"articletypes": [
        {
            "id": "article_a",
            "title": "Article A"
        },
        {
            "id": "article_b",
            "title": "Article B"
        },
        {
            "id": "article_c",
            "title": "Article c"
        }
    ]}
}
```
Use `articletypes` to specify the different article types you want the plugin to handle.

## Article type format in article

When applying an article type to an article the relation will be represented as a link;

```xml
<newsItem>
    <contentMeta>
        <links xmlns="http://www.infomaker.se/newsml/1.0">
            <link title="Article A" rel="articletype" type="x-im/articletype" uri="im://articletype/article_a"/>                
        </links>
    </itemMeta>
</newsItem>
```
