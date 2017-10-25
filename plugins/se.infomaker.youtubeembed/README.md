# Youtube embed plugin
This plugin handles drop of youtube links in an article.

## Plugin configuration
```json
{"data": {
    "disableUseOfAnnotationTools": true,
    "alternateLinkTitle": "{author_name} postade en video - {text}"
}}
```
The `disableUseOfAnnotationTools` enable/disable the use of text annotations like "bold". `alternateLinkTitle`
sets the `title` on the link element for the "alternate" youtube link (used as a fallback if front cannot render
the youtube object type).

## Output
In the article, the youtube link will be represented as the example below;

```xml
<object id="youtubeembed-9fd64624349e14c20438302b6e362e52" type="x-im/youtube" url="https://www.youtube.com/watch?v=YY32ZGjyb84" uri="https://www.youtube.com/watch?v=YY32ZGjyb84">
    <data>
        <start>0</start>
    </data>
    <links>
        <link rel="alternate" type="text/html" url="https://www.youtube.com/watch?v=YY32ZGjyb84" title="Jantelagen postade en video - Säl planerar julbord"/>
        <link rel="alternate" type="image/jpg" url="https://i.ytimg.com/vi/YY32ZGjyb84/hqdefault.jpg">
            <data>
                <width>480</width>
                <height>360</height>
            </data>
        </link>
    </links>
</object>
```