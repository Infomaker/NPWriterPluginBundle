# Iframely Plugin
Documentation of the Iframely plugin.

## 1 - Iframely plugin configuration
**Important note:** The Iframely plugin catches all URLs by default so it must be loaded after all other plugins that will handle URLs unless you set up a whitelist and/or a blacklist.

```json
{
    "id": "se.infomaker.iframely",
    "name": "iframely",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-iframely.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-iframely.css",
    "mandatory": false,
    "enabled": true,
    "data": {
        "apiKey": "Your_Iframely_API_key",
        "restoreAfterFailure": true,
        "omitScript": false,
        "urlWhitelist": [],
        "urlBlacklist": [],
        "alternateLinkTitle": "{author_name} posted {text}",
        "contexts": {
            "Overridden": ["youtube", "twitter"]
        }
    }
}
```

### 1.1 - Options

#### `apiKey`- Iframely API key
The Iframely plugin requires an API key to fetch embeds. Sign up to [Iframely](https://iframely.com/plans) to get a key. After signing up, your API key can be found on the [profile page](https://iframely.com/profile) under **Embeds API Access**

#### `restoreAfterFailure` - Restore link after failure
Set to true to reinsert the pasted link in case Iframely can not fetch the embed.

#### `omitScript` - Omit the script tag in the embedCode element
Set to true to disable adding the included iframely embed.js script to all embed codes. See [Omit script](https://iframely.com/docs/omit-script) in the Iframely docs for more information.

#### `urlWhitelist` - URL whitelist
*Optional* An array of strings that can be converted into regular expressions the Iframely plugin will match against. If empty, the plugin will match against all URLs. The URL will be matched against the whitelist before the blacklist.

##### Example
```js
// Only match URLs that contain 'foo'
"urlWhitelist": ["foo"]

// Only match URLs that end in '/foo' or '/bar'
"urlWhitelist": ["/foo$", "/bar$"]
```

#### `urlBlacklist` - URL blacklist
*Optional* An array of strings that can be converted into regular expressions the Iframely plugin will not match against. If empty, the plugin will match against all URLs. The URL will be matched against the whitelist before the blacklist

##### Example
```js
// Don't match URLs that contain 'foo'
"urlBlacklist": ["foo"]

// Don't match URLs that end in '/foo' or '/bar'
"urlBlacklist": ["/foo$", "/bar$"]
```

### `alternateLinkTitle` - Link Title Template String
*Optional* Sets a template which renders the `title`-attribute in the `alternate`-link. The template is able to fetch properties
from the fetched oEmbed values from the Iframely API. Default value is `"{text}"`.

### `contexts` - Object containing contexts and lowercased provider names
*Optional* Only relevant for alternate rendering methods.
It's possible to override an embedded content's context, or creating new contexts
for content not built into the plugin.

#### Default Provider Contexts
The iFramely plugin supports some popular embeddable providers and maps these
to default contexts. If a provider is not supported, and not specified in
the plugin's `contexts`-config, the `<context>`-element in the newsML is omitted.

| Context | Providers |
| ------- | --------- |
| Video   | youtube, vimeo |
| Social  | instagram, twitter, facebook |

#### Context Override Example
To add a provider to a different or new context, or add a new provider to a context, use the
following format:
```json
"contexts": {
    "Different Youtube Context": ["youtube"], // Provider should be lowercased
    "New Context": ["linkedin"] // Adding a new context and new provider
}
```

The plugin will check the configured contexts first, then default contexts.

To find the provider-name of an embeddable source, test the url at [iFramely's test tool](https://iframely.com/embed).



#### Available Template Tags
| Tag | Description |
| --- | ----------- |
| `{author_name}` | Name of author/creator |
| `{author_url}` | Url to author of content |
| `{provider_name}` | Provider of resource, e.g YouTube, Instagram |
| `{text}` | Title of the content |

#### Example
```js
    "alternateLinkTitle": "{author_name} posted {text} on {provider}"
```
Would render
```
    Test Testsson posted My Cool Article on Instagram
```


### 1.2 - Iframely settings
Some settings can only be changed on the Iframely [settings page](https://iframely.com/settings/api)

#### Setting: Use smart iFrames as proxy in HTML codes?
The option `Always smart iFrames for security, speed and any HTML options` should be enabled.

#### Setting: What if no HTML code?
The option `Respond with error 417 when API call results in no embed codes` should be enabled. The plugin will still work without this enabled, but any URLs that do not produce an embed code will count towards the API usage.

## 2 - Newsml format
```xml
<object id="..." type="x-im/iframely" url="https://www.infomaker.se/">
    <data>
        <title>Title of the embed</title>
        <embedCode>
            <![CDATA[<iframe src="..."></iframe>]]>
        </embedCode>
    </data>
    <links>
        <link rel="alternate" type="text/html" title="Instagram post by Cats of Instagram  from Instagram" url="https://www.instagram.com/p/BeglN_bHruW/?hl=en&amp;taken-by=cats_of_instagram">
            <data>
                <context>Social</context>
                <description>From @Morris_the_persian_cat: "Hey ladies! Wanna know what my sweater is made of? Boyfriend material." #catsofinstagram</description>
                <provider>Instagram</provider>
            </data>
        </link>
        <link rel="alternate" type="image/jpg" url="https://scontent-iad3-1.cdninstagram.com/vp/2543b8ff10bea7a919032afe8fb7a7ec/5B02A2F2/t51.2885-15/e35/26429239_1589573814423494_7174194954695081984_n.jpg">
            <data>
                <width>1080</width>
                <height>1080</height>
            </data>
        </link>
    </links>
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

### 2.3 - Object > links
