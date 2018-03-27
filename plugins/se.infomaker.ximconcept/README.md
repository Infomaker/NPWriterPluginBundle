# Concept plugin

This plugin handles all of Infomakers supported `Concepts types`. The plugin itself will handle any type it's
configured to handle, but is dependent on external config and templates to enable create/edit actions on concepts.

## Dependencies

requires `writer => 4.3.0`
requires `open content > 2.0.1`

## Supported types

As of now these are the supported types ([External link](https://github.com/Infomaker/writer-format/blob/master/newsml/conceptitem/im-conceptitem-spec.md))

- x-im/category
- x-im/tag
- x-im/person
- x-im/organisation
- x-im/content-profile
- x-im/place
- x-im/event
- x-im/author
- x-im/story


### Plugin config

The plugin can be configured to handle one or many types, it can also be configured to handle one or many subtypes.
(e.g type x-im/place, subtypes, position, polygon).

#### Example Configs

Place:

```json
{
    "id": "se.infomaker.ximconcept.place",
    "name": "ximconcept",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximconcept.js?concept=place",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximconcept.css?concept=place",
    "enabled": true,
    "mandatory": false,
    "data": {
        "label": "Platser",
        "name": "x-im/place",
        "enableHierarchy": false,
        "editable": true,
        "appendDataToLink": true,
        "placeholderText": "Sök platser",
        "googleMapAPIKey": "AIzaSyAdlr4ZwU9U8kD9ophla29QaHboNIiyj5c",
        "subtypes": [
            "position",
            "polygon"
        ]
    }
}
```

Author:

```json
{
    "id": "se.infomaker.ximconcept.author",
    "name": "ximconcept",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximconcept.js?concept=author",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximconcept.css?concept=author",
    "enabled": true,
    "mandatory": false,
    "data": {
        "label": "Författare",
        "name": "x-im/author",
        "enableHierarchy": false,
        "editable": true,
        "placeholderText": "Sök skribent",
        "appendDataToLink": true,
        "provider": "writer",
        "pubStatus": "imext:draft"
    }
}
```

Tags:

```json
{
    "id": "se.infomaker.ximconcept.tags",
    "name": "ximconcept",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximconcept.js?concept=tags",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximconcept.css?concept=tags",
    "enabled": true,
    "mandatory": false,
    "data": {
        "label": "Taggar",
        "name": "x-im/tag",
        "enableHierarchy": true,
        "editable": true,
        "placeholderText": "Sök taggar",
        "types": {
            "x-im/person": {
                "name": "Person",
                "editable": true
            },
            "x-im/organisation": {
                "name": "Organisation",
                "editable": true
            },
            "x-im/category": {
                "name": "Category",
                "editable": false
            }
        }
    }
}
```

- `"label": "Författare"` The label to use above the plugin
- `"name": "x-im/author"` The main concept type to be used by the plugin instance
- `"enableHierarchy": false` If the plugin should display broader relations
- `"editable": true` If the concepts should be editable from NPWriter
- `"placeholderText": "Sök skribent"` The search form placeholder
- `"appendDataToLink": true` If data should be added to article link, also depends on remote concept config
- `"provider": "writer"` Used when a new concept is created from the writer, defaults to writer
- `"pubStatus": "imext:draft"` Used when a new concept is created from the writer, defaults to `"imext:draft"`
- `"googleMapAPIKey": "XXX"` API-key used to populate maps when plugin is used with type x-im/place
- `"types": [... ]` A list of types that will be used by the plugin, if this is set, name wont be used
- `"subtypes": [...]` A list of subtypes that are allowed

### Writer config

The new concept plugin requires `writer > 3.10.1` and depends on `writer.ConceptService` class. This class needs
configuration from the writer config file.

```json
"conceptServiceConfig": {
    "conceptPath": "https://s3-eu-west-1.amazonaws.com/concepts-config-dev/writer/",
    "baProxy": {
        "protocol": "http://",
        "hostName": "localhost",
        "port": "5555",
        "healthPath": "/health",
        "queryPath": "/search",
        "objectPath": "/objects"
    },
    "contenttype": "Concept",
    "broaderLimit": 3,
    "relatedGeoFunction": "Contains",
    "relatedGeoExludeSelf": false,
    "searchLimit": 50,
    "sortField": "ConceptNameString",
    "propertyMap": {
        ...
    }
}
```

- `"conceptPath": "https://...",` A remote path from where ConceptService can load concept config and templates
- `"contenttype": "Concept",` Concepts contentType in OC
- `"broaderLimit": 3,` How many steps ConceptService should follow Broader links
- `"relatedGeoFunction": "Contains",` Function to use when adding related geo zones to article (Contains/Intersects/IsWithin)
- `"relatedGeoExludeSelf": false,` If added geo concepts should be excluded from `related-geo` tag
- `"searchLimit": 50,` Sets the search limit for concept searches
- `"sortField": "ConceptNameString",` Which index field to sort by
- `"propertyMap": { ... }` See below

#### BA_PROXY

The ba_proxy is used for Open Content search requests and is a temporary dependency that will be replaced by search
functionality through writer backend/editorservice.

#### Property map

The property map is used to translate different kind of OC configurations into prop names ConceptService can use.
The left hand side will be used by ConceptService, fill in the property-names from OC on the right hand side.

```json
"propertyMap": {
    "uuid": "uuid",
    "ConceptName": "ConceptName",
    "ConceptStatus": "ConceptStatus",
    "ConceptDefinitionShort": "ConceptDefinitionShort",
    "ConceptDefinitionLong": "ConceptDefinitionLong",
    "ConceptImTypeFull": "ConceptImTypeFull",
    "ConceptImSubTypeFull": "ConceptImSubTypeFull",
    "ConceptGeometry": "ConceptGeometry",
    "ConceptAvatarUuid": "ConceptAvatarUuid",
    "ConceptBroaderRelation": "ConceptBroaderRelation",
    "ConceptReplacedByRelation": "ConceptReplacedByRelation"
}
```

## Output
Each selected or created concept will generate a link inside the article's `itemMeta` element.

```xml
<link rel="subject" title="Cool corp." type="x-im/organisation" uuid="63d5dcc1-28f1-4892-9f44-142043541de1"/>
```

If the plugin config `appendDataToLink` is set to `true`, concept data will be added as data to the link. The article
data instructions are read from a remote config file that is unique per concept type.

```xml
<link rel="author" title="Rob Zombie!" type="x-im/author" uuid="ccdbcf5a-4fba-4d61-bb2f-8469a7c5d357">
    <data>
        <email>robert@demonoid.nu</email>
        <firstName>Rob</firstName>
        <lastName>Zombie</lastName>
        <facebookUrl>https://www.facebook.com/RobZombie/</facebookUrl>
        <shortDescription>Testar</shortDescription>
        <longDescription>Testar</longDescription>
    </data>
</link>
```

### Broader
Concepts with a `rel broad` will be decorated with data about the concepts hierarchical chain to the depth
specified in ConcepService Config:

![](./doc-images/broader.png)

```json
"broaderLimit": 3,
```

```xml
<link rel="subject" title="Elitserien" type="x-im/category" uuid="b3c8f46f-00db-4e23-a98f-69494582aacc">
    <links>
        <link rel="subject" title="Ishockey" type="x-im/category" uuid="72addee2-b68d-4f39-9e5f-0f1c45c0637e"/>
        <link rel="subject" title="Sport" type="x-im/category" uuid="45f12bb9-3cfc-494a-aeb5-49008812bb47"/>
    </links>
</link>
```

### Replaced by

If a concept has been marked with "replaced by", the new concept will be added if selected:

![](./doc-images/replaced-by.png)


### x-im/polygon

If the ConceptService config property `relatedGeoFunction` is set, a background check will be made to look up areas
that correlates with selected polygon. The correlating areas will be added to the article as a `related-geo link` tag.

Available functions are: `"Contains"`, `"Intersects"`, `"IsWithin"`. These links are not displayed to the user but are
to be considered as an extension available for searching.

```xml
<link rel="subject" title="Oxhagen" type="x-im/place" uuid="952adffb-1a8e-492c-b5b1-175df1f91874">
<data>
    <geometry>POLYGON((16.337724687158243 56.67353746432897,
        16.34029960781254 56.674952121793844,
        16.339870454370157 56.67806418123245,
        16.337724687158243 56.67820563237095,
        16.333690644799844 56.677922729562766,
        16.330171586572305 56.677781277361916,
        16.3298282638184 56.67627242083415,
        16.32776832729496 56.67551796990587,
        16.327854157983438 56.67443342022474,
        16.33480644375004 56.67363177647931,
        16.337724687158243 56.67353746432897))</geometry>
    </data>
</link>
<link rel="related-geo">
    <data>
        <uuid title="Kalmar">320938f8-db94-11e5-b5d2-0a1d41d68578</uuid>
        <uuid title="Oxhagen">952adffb-1a8e-492c-b5b1-175df1f91874</uuid>
    </data>
</link>
```
