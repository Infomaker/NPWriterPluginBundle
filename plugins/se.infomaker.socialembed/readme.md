## Rendering Facebook post and Tweets

Rendering Facebook and Tweets requires that external libraries from Twitter and Facebook is loaded in the browser.

This is handled by the writer it self, that's why the configuration for appId and disabling is placed directly in the writer configuration.


### Disable loading of external libraries

Loading external libraries can be disabled using: `disableExternalSocialEmbeds`.

```javascript

"disableExternalSocialEmbeds": true

```

### Add facebookAppId 

`facebookAppId` is required in writer configuration file

A appId key can be retrieved by creating an app at Facebook. [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)


```

"facebookAppId":"XXX"

```



## Alternate links configuration

Alternate links is created for every social embed object. 

There is more information about alternate links at [Writer-format at Github](https://github.com/Infomaker/writer-format/blob/master/newsml/newsitem/newsitem-text.xml)



Following variables could/should be defined in Writer Config.

`alternateTwitterTitle`

`alternateInstagramTitle`

`alternateFacebookTitle`

`alternateDefaultTitle`

        
`{author_name}` is available as a string variable that will be replaced with the actual author name.
        
_Example_

`"alternateTwitterTitle": "{author_name} tweeted"`

`"alternateFacebookTitle": "{author_name} posted on Facebook"`
        
        
```
"data": {
  "alternateTwitterTitle": "{author_name} skrev på Twitter",
  "alternateInstagramTitle": "{author_name} postade en bild på Instagram. {text}",
  "alternateFacebookTitle": "{author_name} postade på Facebook",
  "alternateDefaultTitle": "{author_name} postade på {provider_name}"
}
```


