# Author Plugin

## Configuration
In the `data` section of the plugin configuration,
the `noSearch` entry may be set to true to disable search. 

The configuration entry `handleConceptAuthors` decides whether the plugin should
 create authors as `Concepts or not`.
 
Configuration entry `appendAuthorDataToLink` will, if set to true, append author
data like phone, short description etc, to the link in the article.
 
 E.g.

```json
{
  "data":{
    "handleConceptAuthors": true,
    "appendAuthorDataToLink": true,
    "noSearch": false
  }
}
```

Example of link created in article with the configuration example above:

```xml
<newsItem>
    <itemMeta>
        <links>
            <link rel="author" title="Allan Thompson" type="x-im/author"
                uuid="1f2bf043-967b-4681-a91c-e9d05f177882">
                <data>
                    <email>allan@example.org</email>
                    <firstName>Allan</firstName>
                    <lastName>Thompson</lastName>
                    <phone>2343534523</phone>
                    <facebookUrl>https://facebook.com/allan</facebookUrl>
                    <twitterUrl>https://twitter.com/allan</twitterUrl>
                    <shortDescription>Allan.</shortDescription>
                    <longDescription>Allan Thompson, pilot.</longDescription>
                </data>
            </link>
        </links>
    </itemMeta>
</newsItem>
```
Example of link created in article with `appendAuthorDataToLink` set to false:

```xml
<newsItem>
    <itemMeta>
        <links>
            <link rel="author" title="Allan Thompson" type="x-im/author"
                uuid="1f2bf043-967b-4681-a91c-e9d05f177882">
                <data>
                    <email>allan@example.org</email>                   
                </data>
            </link>
        </links>
    </itemMeta>
</newsItem>
```

Documentation of "contract" between plugin and the backend used.

## Backend endpoints 
### Search
Search for authors.
##### Request
`POST /commands`

Request body:
```json
{"action":"search", "data": {"entity": "authors", "query":"j**"}}
```
##### Response
Response, if found (`200 OK`) should be;
```json
[
  {
    "uuid": "0b358dc6-d54f-11e5-ab30-625662870761",
    "name": [
      "Jason Hook"
    ],
    "description": [
      "Jason Hook (born Thomas Jason Grinstead on October 3, 1970) is a Canadian guitarist, record producer, songwriter and session musician"
    ],
    "shortDescription": [
      "Jason Hook"
    ],
    "type": [
      "person"
    ],
    "typeCatalog": [
      "cpnat"
    ],
    "imType": [
      "x-im/author"
    ]
  },
  {
    "uuid": "5f9b8064-d54f-11e5-ab30-625662870761",
    "name": [
      "Jeremy Spencer"
    ],
    "description": [
      "Jeremy Spencer is an American musician, songwriter and record producer. He is the drummer for the metal band, Five Finger Death Punch."
    ],
    "shortDescription": [
      "Jeremy Spencer"
    ],
    "type": [
      "person"
    ],
    "typeCatalog": [
      "cpnat"
    ],
    "imType": [
      "x-im/author"
    ]
  }
]
```
If no match then response (`200 OK`) should simply be;
```json
[]
```

### Thumbnail
Get author thumbnail to render.
##### Request
`POST /commands`

Request body:
```json
{"action":"thumbnail","data":{"url":"https://twitter.com/johndoe"}}
```

##### Response
Response should be an URL to a reachable thumbnail if found (status code `200 OK`)
```
http://pbs.twimg.com/profile_images/582222032739266561/GVZk2caU_normal.jpg
```





