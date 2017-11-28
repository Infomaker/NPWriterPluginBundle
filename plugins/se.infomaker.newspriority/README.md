# Newspriority plugin
Plugin handles the different newspriority information that can be attached to the article.

## Plugin configuration
Note that configuration values in json below are examples.

```json
{
      "id": "se.infomaker.newspriority",
      "name": "newspriority",
      "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximnewspriority.js",
      "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximnewspriority.css",
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
It is possible to disable lifetime, which is done by setting the `preventLifetime` key to `true` in the config above.

## Output
In the article, the plugin will add the following xml block under `newsItem > contentMeta > metadata`:

```xml
<object id="RYaudnAJj8gQ" type="x-im/newsvalue">
    <data>
        <score>3</score>
        <description>1D</description>
        <format>lifetimecode</format>
        <end/>        
        <duration>84600</duration>
    </data>
</object>
```

The `score` element maps to the `value` key in the `scores` array in the configuration.

The `description`, `end` and `duration` maps to the keys in the `lifetime` array in the configuration.