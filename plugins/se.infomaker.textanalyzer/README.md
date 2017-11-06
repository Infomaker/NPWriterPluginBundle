# Text analyzer plugin
Renders create and update timestamps and displays word and character count of the article. If 
"source" is present in the article, this information will also be displayed. The source information
is represented by a link element in `newsItem > contentMeta > links`.

```xml
<link rel="articlesource" title="Online" type="x-im/articlesource" uri="im://articlesource/online"/>
```

The attribute `title` is rendered.

## Plugin configuration
No `data` configuration needed.

## Output
None.