# Options plugin

The options plugin provides a list of options of a configurable type. The selected options are represented in the document as 
content meta links. Here's an example where a user marked the article as being 'interesting'.

    <newsItem ...>
       <contentMeta>
        <links>
          <link rel="articleoptions" title="Interesting" type="x-im/articleoptions" rel="im:articleoptions/interesting"/>
        </links>
      </contentMeta>
    </newsItem> 


## Configuration


Options are specified, in the writer client configuration file, as a specific type. Each type has a configurable number of options to choose from.

    {
          "id": "se.infomaker.options",
          "name": "options",
          "url": "http://localhost:5001/im-options.js",
          "enabled": true,
          "mandatory": true,
          "data": {
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
            }
          }
        }

The example above states a dropdown list with 4 selectable items.
The multivalue options is set to false, which means that only one value may be selected.
The fourth option 'Article tone' has a sub-list defined with three options.
It's a toggle style and since multivalue is set to true, it is possible to select any number of these options.


The option plugin supports being defined multiple times in the configuration file so that
completely different options may be handled by this plugin. *The id must be set to different values
in order for this to function, e.g.*

     {
        "id": "se.infomaker.socialoptions",
        "name": "socialoptions",
        "url": "http://localhost:5001/im-options.js",
        "enabled": true,
        "mandatory": true,
            ...
    },
    {
        "id": "se.infomaker.articletone",
        "name": "articletone",
        "url": "http://localhost:5001/im-options.js",
        "enabled": true,
        "mandatory": true,
            ...
    }        


## Components to represent selectable values

The plugin supports three types of components for selecting values: dropdown-, toggle- and button components.

### Dropdown

The dropdown component, configured with **dropdown** supports selecting a single value:

    ------------------------
    | Choose something | V |
    ------------------------

#### Example configuration

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
                  "uri": "im://articleoptions/premium",
                  "title": "Premium"
                },
                ...


### Button

The button component, configured with **button** stacks horizontally and supports selecting multiple values: 

    [Value 1] [Value 2] [Value 3]
    [Value 4]

#### Example configuration

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
                      "title": "Premium"
                    },
                    ...

    
### Toggle
    
The toggle component, configured with **toggle** stacks vertically and supports selecting multiple values:

    [ O] Value 1 
    [O ] Value 2 
    [O ] Value 3 
    
#### Example configuration

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
                      "title": "Premium"
                    },
                    ...

