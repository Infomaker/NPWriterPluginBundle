# Content profile plugin
This plugin handles searching and selecting "content profiles" for an article. These concept profiles are `Concepts` which
are documented here: https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem.

The user can create new and edit existing content profiles in the plugin. New content profiles are created using
the template specified in the `template/contentprofile.js` file.

## Plugin configuration
None in the actual plugin. The types of `Concepts` that are handled by the plugin is dictated by configuration of the
customers configuration file in [Concept Backend](https://bitbucket.org/infomaker/concepts-backend).

## Output
In the article, the plugin will add the following xml block under `newsItem > itemMeta > links`:
```xml
<link title="Over 50" uuid="8cea8425-c639-4550-8712-a2805e085ada" rel="subject" type="x-im/content-profile"/>
```

## Backend
The plugin communicates with Concept Backend in order to search for content profile `Concepts`. Configuration for this
communication is configured in Writers server config file under property `conceptbackend`. When searching, the plugin 
will make a "search" request of type/entity `contentprofiles` towards the Concept Backend. Details regarding this request 
is specified in [Concept Backend](https://bitbucket.org/infomaker/concepts-backend).