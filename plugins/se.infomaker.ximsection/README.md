# Section plugin
This plugin enables user to choose a section for the article. Sections available are configurable (see below).
Sections are rendered in a drop down menu. Only one section is allowed for an article.

## Plugin configuration
```json
{
    "id": "se.infomaker.ximsection",
    "name": "ximsection",
    "url": "http://localhost:5001/index.js",
    "style": "http://localhost:5001/style.css",
    "mandatory": false,
    "enabled": true,
    "data": {"sections": [
        {
            "qcode": "imsection:debate",
            "name": "Debate"
        },
        {
            "qcode": "imsection:comments",
            "name": "Comments"
        },
        {
            "qcode": "imsection:work_and_money",
            "name": "Work and Money"
        },
        {
            "qcode": "imsection:kalmar",
            "name": "kalmar",
            "product": "imchn:site-x.se"
        },
        {
            "qcode": "imsection:reviews",
            "name": "Reviews",
            "product": "imchn:site-x.se"
        },
        {
            "qcode": "imsection:evelina",
            "name": "Evelina",
            "product": "imchn:site-y.se"
        }
    ]}
}
 ```
 The qcode prefix of sections `imsection` is what identifies this as a section. If a section is configured with a 
 product, this is appended before the name of the section when rendering the plugin. The property `product` is specified as
 a "qcode" hence the prefix.

## Output 
The plugin adds selected section as a `service` element (`newsItem > itemMeta`)with the following format;

```xml
 <service qcode="imsection:work_and_money">
    <name>Work and Money</name>
 </service>
```

If selected section has a parent product this is reflected by attribute `pubconstraint`. E.g;

```xml
 <service qcode="imsection:work_and_money" pubconstraint="imchn:kkuriren.se">
    <name>Work and Money</name>
 </service>
```

If article already has a section it will be removed and the new section added.
