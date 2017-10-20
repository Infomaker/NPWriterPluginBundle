# News priority plugin
This plugin sets priority and lifetime for an article.

## NewsItem format

The plugin adds metadata to the contentMeta block in the NewsML XML.

```xml
    <contentMeta>
        <metadata xmlns="http://www.infomaker.se/newsml/1.0">
            <object id="RYaudnAJj8gQ" type="x-im/newsvalue">
                <data>
                    <score>3</score>
                    <description>6H</description>
                    <format>lifetimecode</format>
                    <end/>
                    <duration>21600</duration>
                </data>
            </object>
        </metadata>
    </contentMeta>
```

The `score` element maps to the `value` key in the `scores` array in the configuration.

The `description`, `end` and `duration` maps to the keys in the `lifetime` array in the configuration.

## Configuration


```json
{
      "id": "se.infomaker.newspriority",
      "name": "newspriority",
      "url": "http://localhost:5001/im-ximnewspriority.js",
      "style": "http://localhost:5001/im-ximnewspriority.css",
      "mandatory": false,
      "enabled": true,
      "data": {
        "preventLifetime": false,
        "durationKey": "duration",
        "defaultLifetimesIndex": "1",
        "defaultScoresIndex": 1,
        "scores": [
          {
            "value": 1,
            "text": "Breaking news"
          },
          {
            "value": 2,
            "text": "High"
          },
          {
            "value": 3,
            "text": "Medium"
          },
          {
            "value": 4,
            "text": "Low"
          }
        ],
        "lifetimes": [
          {
            "value": "3600",
            "label": "6H",
            "text": "6 hours"
          },
          {
            "value": "84600",
            "label": "1D",
            "text": "1 day"
          },
          {
            "value": "592200",
            "label": "7D",
            "text": "7 days"
          },
          {
            "value": "",
            "label": "∞",
            "text": "Forever"
          },
          {
            "value": "custom",
            "label": "Tid",
            "text": "Custom"
          }
        ]
      }
}
```

It is possible to disable lifetime, which is done by setting the `disableLifetime` key to `true` in the config above.

