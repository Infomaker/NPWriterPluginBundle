# Author Plugin
This plugin handles searching and selecting "authors" for an article. These authors are `Concepts` which
are documented here: https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem.

Depending on the plugin configuration (see below), the user can create, edit and/or read only authors.

## Plugin configuration
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

## Output
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