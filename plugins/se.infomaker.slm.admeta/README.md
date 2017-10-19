# Admeta Plugin

Enables adding ad keywords and an ad campaign ID to the article.

## Configuration
```json
{
    "id": "se.infomaker.slm.admeta",
    "name": "admeta",
    "url": "http://localhost:5001/slm-admeta.js",
    "enabled": true,
    "mandatory": false
}
```

## Output
The plugin will add the following object of type `x-im/admeta` object under `newsItem > contentMeta > metadata`:

```xml
<object id="MTIzLDIwNSwyMzYsNTM" type="x-im/admeta">
    <data>
        <keywords>
            <keyword>nyckelord-01</keyword>
            <keyword>nyckelord-02</keyword>
        </keywords>
        <campaignId>kampanj-id-01</campaignId>
    </data>
</object>
```
