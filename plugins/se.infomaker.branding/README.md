# Branding plugin

The branding plugin provides a way to override text elements in Writer components and plugins.
Example of things that may be overriden are:

* Name and short name for paragraph styles
* Metadata plugin labels

## Configuration


    {
      "id": "se.infomaker.branding",
      "name": "branding",
      "url": "http://localhost:5001/im-branding.js",
      "enabled": true,
      "mandatory": false,
      "data": {
        "ximstory-story": {"en":"Chapter", "sv": "Kapitel"},
        "ximstory-search_stories": {"en":"Search chapter", "sv": "Hitta kapitel"},
        "ximstory-error-save": {"en":"Error when saving chapter", "sv":"Fel vid sparande av kapitel"},
        "dateline.short": {"sv":"ORT"}
      }
    }


The example above overrides labels for the `ximstory` plugin and renames it to 'Chapter' in english
and 'Kapitel' in swedish.

Also, the short description for 'dateline' paragraph style is renamed to 'ORT' for swedish.
