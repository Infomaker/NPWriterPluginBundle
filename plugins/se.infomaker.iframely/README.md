# Iframely Plugin
Documentation of the Iframely plugin.

## 1 - Iframely plugin configuration
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

### 1.1 - Options

#### `apiKey`- Iframely API key
The Iframely plugin requires an API key to fetch embeds. Sign up to [Iframely](https://iframely.com/plans) to get a key. After signing up, your API key can be found on the [profile page](https://iframely.com/profile) under **Embeds API Access**

#### `restoreAfterFailure` - Restore link after failure
Set to true to reinsert the pasted link in case Iframely can not fetch the embed.

#### `urlWhitelist` - URL whitelist
*Optional* An array of regular expressions the Iframely plugin will match against. If empty, the plugin will match against all URLs. The URL will be matched against the whitelist before the blacklist.

##### Example
```js
// Only match URLs that contain 'foo'
"urlWhitelist": [/foo/]

// Only match URLs that end in '/foo' or '/bar'
"urlWhitelist": [/\/foo$/, /\/bar$/]
```

#### `urlBlacklist` - URL blacklist
*Optional* An array of regular expressions the Iframely plugin will not match against. If empty, the plugin will match against all URLs. The URL will be matched against the whitelist before the blacklist

##### Example
```js
// Don't match URLs that contain 'foo'
"urlBlacklist": [/foo/]

// Don't match URLs that end in '/foo' or '/bar'
"urlBlacklist": [/\/foo$/, /\/bar$/]
```

### 1.2 - Iframely settings
Some settings can only be changed on the Iframely [settings page](https://iframely.com/settings/api)


## 2 - Newsml format
```xml
<object id="..." type="x-im/iframely" url="https://www.infomaker.se/">
    <data>
        <title>Title of the embed</title>
        <embedCode>
            <![CDATA[<iframe src="..."></iframe>]]>
        </embedCode>
    </data>
</object>
```
### 2.1 - Object

#### URL
```xml
<object id="..." type="x-im/iframely" url="https://www.infomaker.se/">
```
The original URL of the request is stored as an URL attribute in case the data has to be fetched by Iframely again.

### 2.2 - Object > data

#### Title
```xml
<title>Title of the embed</title>
```
The title of the embed provided in the oembed response.

#### Embedded HTML
```xml
<embedCode>
    <![CDATA[<iframe src="..."></iframe>]]>
</embedCode>
```
The embed data returned by the Iframely API is stored as `<embedCode>`.
