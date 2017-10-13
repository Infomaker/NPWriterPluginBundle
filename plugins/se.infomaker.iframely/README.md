# Iframely Plugin
Documentation of the Iframely plugin.

## 1 Iframely plugin configuration
**Important note:** The Iframely plugin catches all URLs by default so it must be loaded after all other plugins that will handle URLs unless you set up a whitelist and/or a blacklist.

```json
{
    "id": "se.infomaker.iframely",
    "name": "iframely",
    "url": "http://url-to/im-iframely.js",
    "style": "http://url-to/im-iframely.css",
    "mandatory": false,
    "enabled": true,
    "data": {
        "apiKey": "Your_Iframely_API_key",
        "restoreAfterFailure": true,
        "urlWhitelist": [],
        "urlBlacklist": []
    }
}
```

### 1.1 Options

#### `apiKey`- Iframely API key
The Iframely plugin requires an API key to fetch embeds. Sign up to [Iframely](https://iframely.com/plans) to get a key. After signing up, your API key can be found on the [profile page](https://iframely.com/profile) under **Embeds API Access**

#### `restoreAfterFailure` - Restore link after failure
Set to true to reinsert the pasted link in case Iframely can not fetch the embed.

#### `urlWhitelist` - URL whitelist (Not implemented)
*Optional* An array of regular expressions the Iframely plugin will match against. If empty, the plugin will match against all URLs.

#### `urlBlacklist` - URL blacklist (Not implemented)
*Optional* An array of regular expressions the Iframely plugin will not match against. If empty, the plugin will match against all URLs.

### 1.2 Iframely settings
Some settings can only be changed on the Iframely [settings page](https://iframely.com/settings/api)


## 2 Newsml format
```xml
<object id="..." type="x-im/iframely" url="https://www.infomaker.se/">
    <data>
        <embedCode>
            <![CDATA[<iframe src="..."></iframe>]]>
        </embedCode>
    </data>
</object>
```
### 2.1 Options
#### URL
```xml
<object id="..." type="x-im/iframely" url="https://www.infomaker.se/">
```
The original URL of the request is stored as an URL attribute in case the data has to be fetched by Iframely again.

#### Embedded HTML
```xml
<data>
  <embedCode>
  <![CDATA[<iframe src="..."></iframe>]]>
  </embedCode>...
```
The data returned by the Iframely API is stored as `<embedCode>`.