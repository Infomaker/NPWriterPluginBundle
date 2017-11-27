# Options plugin
The options plugin provides a list of options of a configurable type. 

## Plugin configuration
Options are specified, in the writer client configuration file, as a specific type. Each type has a configurable number 
of options to choose from.
```json
{
    "id": "se.infomaker.options",
    "name": "options",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-options.js",
    "enabled": true,
    "mandatory": true,
    "data": {"options": {
        "type": "dropdown",
        "label": "Article options",
        "link": {
            "rel": "articleoptions",
            "type": "x-im/articleoptions"
        },
        "multivalue": false,
        "values": [
            {
                "title": "Select article option",
                "label": true
            },
            {
                "uri": "im://articleoptions/premium",
                "title": "Premium"
            },
            {
                "uri": "im://articleoptions/facebok",
                "title": "Facebook"
            },
            {
                "uri": "im://articleoptions/instagram",
                "title": "Instagram"
            },
            {
                "title": "Article tone",
                "uri": "im://articleoptions/tone",
                "list": {
                    "type": "toggle",
                    "label": "Article tone options",
                    "link": {
                        "rel": "articleoptions/tone",
                        "type": "x-im/articleoptions/tone"
                    },
                    "multivalue": true,
                    "values": [
                        {
                            "uri": "im://articleoptions/tone/positive",
                            "title": "Positive tone"
                        },
                        {
                            "uri": "im://articleoptions/tone/neutral",
                            "title": "Neutral tone"
                        },
                        {
                            "uri": "im://articleoptions/tone/negative",
                            "title": "Negative tone"
                        }
                    ]
                }
            }
        ]
    }}
}
```
he example above states a dropdown list with 4 selectable items.
The multivalue options is set to false, which means that only one value may be selected.
The fourth option 'Article tone' has a sub-list defined with three options.
It's a toggle style and since multivalue is set to true, it is possible to select any number of these options.


The option plugin supports being defined multiple times in the configuration file so that
completely different options may be handled by this plugin. *The id must be set to different values
in order for this to function. The name must be set to **options** in order for plugin to register*.

Also, **the URL must be unique** in order for the plugin to load multiple times. This can be achieved
by appending "?..." to the URL. 
```
{
    "id": "se.infomaker.socialoptions",
    "name": "options",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-options.js",
    "enabled": true,
    "mandatory": true,
    ...
},
{
    "id": "se.infomaker.articletone",
    "name": "options",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-options.js?2",
    "enabled": true,
    "mandatory": true,
    ...
}
```

## Components to represent selectable values
The plugin supports three types of components for selecting values: dropdown-, toggle- and button components.

### Dropdown
The dropdown component, configured with **dropdown** supports selecting a single value:

    ------------------------
    | Choose something | V |
    ------------------------

#### Example configuration
```
...
 "options": {
          "type": "dropdown",
          "label": "Article options",
          "link": {
            "rel": "articleoptions",
            "type": "x-im/articleoptions"
          },
          "multivalue": false,
          "values": [
            { 
              "title": "-- Choose something --",
              "label": true
            }, 
            {
              "uri": "im://articleoptions/premium",
              "title": "Premium"
            },
            ...
```

If `"label":true` is set for an item in `values`, the item is considered being a label an does not generate a link in the NewsML. 

### Button
The button component, configured with **button** stacks horizontally and supports selecting multiple values: 

    [Value 1] [Value 2] [Value 3]
    [Value 4]
    
Buttons also have support for icons prepending the name. It is configured in the 'values' section, using the field 'icon'. The value
is any of the Font Awesome icons from http://fontawesome.io/icons/.

It is also possible to have an image icon, which is specified using the 'image' field in the value section.    

#### Example configuration
```
...
 "options": {
          "type": "button",
          "label": "Article options",
          "link": {
            "rel": "articleoptions",
            "type": "x-im/articleoptions"
          },
          "multivalue": true,
          "values": [
            {
              "uri": "im://articleoptions/premium",
              "title": "Premium",
              "icon" : "fa-star-o"
            },
            {
              "uri": "im://articleoptions/priority",
              "title": "Priority",
              "image" : "data:image/svg+xml;base64,..."
            },                    
            ...
```
    
### Toggle
The toggle component, configured with **toggle** stacks vertically and supports selecting multiple values:
```
[ O] Value 1 
[O ] Value 2 
[O ] Value 3
``` 
    
Toggle buttons also have support for icons prepending the title. It is configured in the 'values' section, using the field 'icon'. The value
is any of the Font Awesome icons from http://fontawesome.io/icons/.

It is also possible to have an image icon, which is specified using the 'image' field in the value section.    
        
#### Example configuration
```
...
 "options": {
          "type": "toggle",
          "label": "Article options",
          "link": {
            "rel": "articleoptions",
            "type": "x-im/articleoptions"
          },
          "multivalue": true,
          "values": [
            {
              "uri": "im://articleoptions/premium",
              "title": "Premium",
              "icon" : "fa-star-o"
            },
            {
              "uri": "im://articleoptions/priority",
              "title": "Priority",
              "image" : "data:image/svg+xml;base64,..."
            },                    
            ...
 ```    

## Output
The plugin will add `link` under `newsItem > contentMeta > links`. Here's an example where a user marked the article as 
being 'premium'.
```xml
<newsItem>
    <contentMeta>
        <links xmlns="http://www.infomaker.se/newsml/1.0">
            <link rel="premium" title="Premium" type="x-im/premium" uri="im://premium"/>
        </links>
    </contentMeta>
</newsItem>
```