# Publication channel plugin
Plugin for selecting one or more publication channels for the article.

## Plugin configuration

```json
{"data": {
    "useMainChannel": false,
    "publicationchannels": [
        {
            "qcode": "imchn:internal",
            "name": "internal.se",
            "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR",
            "iconInactive": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0i"
        },
        {
            "qcode": "imchn:public",
            "name": "public.se",
            "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOD",
            "iconInactive": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOD"
        },
        {
            "qcode": "imchn:demo",
            "name": "demo.se",
            "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTg",
            "iconInactive": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTc"
        }
    ]
}}
```

## Output
In the article, the plugin will add the following xml block under `newsItem > itemMeta`:
```xml
<service qcode="imchn:internal"/>
<service qcode="imchn:demo"/>
```
