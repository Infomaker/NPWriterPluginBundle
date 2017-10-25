# Story plugin
This plugin handles searching and selecting "stories" for an article. These stories are `Concepts` which
are documented here: https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem.

The plugin allows for a user to create a new and edit existing stories.

## Plugin configuration
None in the actual plugin. The types of `Concepts` that are handled by the plugin is dictated by configuration of the
customers configuration file in [Concept Backend](https://bitbucket.org/infomaker/concepts-backend).

## Output
In the article, the plugin will add the following xml block under `newsItem > itemMeta > links`:
```xml
<link title="Climate change" uuid="c5bf489c-a699-4f7e-b3a8-732fbdcf81d4" rel="subject" type="x-im/story"/>
```

## Backend
The plugin communicates with Concept Backend in order to search for story `Concepts`. Configuration for this
communication is configured in Writers server config file under property `conceptbackend`. When searching, the plugin 
will make a "search" request of type/entity `stories` towards the Concept Backend. Details regarding this request 
is specified in [Concept Backend](https://bitbucket.org/infomaker/concepts-backend).