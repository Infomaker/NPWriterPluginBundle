# Content relations plugin
This plugin uses `Concept Backend` to search Writer OC backend for articles and images. From the search result, the
user can drag and drop the article/image onto the article.

## Plugin configuration
No `data` configuration needed. Note that the configuration for how to search and response fields are
handled by `Concept Backend`.

## Output
In the article, the plugin will add the following xml block under `newsItem > contentSet > inlineXML > idf > group`
(e.g. article):

```xml
<object id="contentrelations-e17ef7b21393e2b1dac1c1fbd7ffc597" uuid="e390944b-08cf-426a-b4bd-ea0b9b28a4dc" title="Test article" type="x-im/link">
    <links>
        <link rel="self" type="x-im/article" uuid="e390944b-08cf-426a-b4bd-ea0b9b28a4dc"/>
    </links>
</object>
```

Example of related image:
```xml
<object id="MzcsMjUyLDExMiwyNDY" type="x-im/image" uuid="1f220bbc-87fc-5b73-ab1a-c474ab71d026">
    <links>
        <link rel="self" type="x-im/image" uri="im://image/Rn0GMaBFK7oJyCTdAhcc0-TmZcI.jpg" uuid="1f220bbc-87fc-5b73-ab1a-c474ab71d026">
            <data>
                <width>800</width>
                <height>563</height>
                <text/>
                <credit/>
            </data>
            <links>
                <link rel="author" uuid="00000000-0000-0000-0000-000000000000" title="Photographer: Jean-Jacques Serol" type="x-im/author"/>
                <link rel="author" uuid="00000000-0000-0000-0000-000000000000" title="Photographer: Jean-Jacques Serol/Pepite Photography" type="x-im/author"/>
            </links>
        </link>
    </links>
</object>
```