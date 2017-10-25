# Newspriority plugin
Plugin handles the different newspriority information that can be attached to the article.

## Plugin configuration
Note that configuration values in json below are examples.

```json
{"data": {
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
            "text": "Stoppa pressarna"
        },
        {
            "value": 3,
            "text": "Värdigt för löpet"
        },
        {
            "value": 4,
            "text": "Allmänt intresse"
        },
        {
            "value": 5,
            "text": "Liten notis"
        },
        {
            "value": 6,
            "text": "Katt i träd"
        }
    ],
    "lifetimes": [
        {
            "value": "3600",
            "label": "6H",
            "text": "6 timmar"
        },
        {
            "value": "84600",
            "label": "1D",
            "text": "1 dag"
        },
        {
            "value": "592200",
            "label": "7D",
            "text": "7 dagar"
        },
        {
            "value": "2538000",
            "label": "30D",
            "text": "30 dagar"
        },
        {
            "value": "",
            "label": "∞",
            "text": "För evigt"
        },
        {
            "value": "custom",
            "label": "Tid",
            "text": "Tidsangivelse"
        }
    ]
}}
```

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
