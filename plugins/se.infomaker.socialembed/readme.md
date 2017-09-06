## Add facebookAppId 

`facebookAppId` is required in writer configuration file

A appId key can be retrieved by creating an app at Facebook. [https://developers.facebook.com/apps/](https://developers.facebook.com/apps/)


__Configuration__

```

"facebookAppId":"XXX"

```

## Alternate links configuration

Following variables could/should be defined in Writer Config.

`alternateTwitterTitle`

`alternateInstagramTitle`

`alternateFacebookTitle`

`alternateDefaultTitle`

        
`{author_name}` is available as a string variable that will be replaced with the actual author name.
        
_Example_

`"alternateTwitterTitle": "{author_name} tweeted"`

`"alternateFacebookTitle": "{author_name} posted on Facebook"`
        


