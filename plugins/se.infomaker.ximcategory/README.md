# Category plugin
This plugin handles searching and selecting "categories" for an article. These categories are `Concepts` which
are documented here: https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem.

This is a "read-only" plugin, i.e. the user will not be able to create new categories using the plugin.

## Plugin configuration
None in the actual plugin. The types of `Concepts` that are handled by the plugin is dictated by configuration of the
customers configuration file in [Concept Backend](https://bitbucket.org/infomaker/concepts-backend).

## Output
In the article, the plugin will add the following xml block under `newsItem > itemMeta > links`:
```xml
<link title="Sport" uuid="8cea8425-c639-4550-8712-a2805e085ada" rel="subject" type="x-im/category"/>
```

## Backend
The plugin communicates with Concept Backend in order to search for category `Concepts`. Configuration for this
communication is configured in Writers server config file under property `conceptbackend`. When searching, the plugin 
will make a "search" request of type/entity `categories` towards the Concept Backend. Details regarding this request 
is specified in [Concept Backend](https://bitbucket.org/infomaker/concepts-backend).