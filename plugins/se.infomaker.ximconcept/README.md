# Concept plugin
This plugin handles all of Infomakers supported `Concepts types`. The plugin it self will handle any type its configured to handle, but is dependant on external config and templates to enable create/edit actions on concepts.

### Supported types
```json

```

### Plugin config
The plugin can be configured to handle one or many types, it can also be configured to handle one or many subtypes. (ex type x-im/place, subtypes, position, polygon).

```json
    {
        "id": "se.infomaker.ximconcept.place",
        "name": "ximconcept",
        "url": "http://localhost:5001/im-ximconcept.js?concept=place",
        "style": "http://localhost:5001/im-ximconcept.css?concept=place",
        "enabled": true,
        "mandatory": false,
        "data": {
            "label": "Platser",
            "name": "x-im/place",
            "enableHierarchy": true,
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

### Writer config
The new concept plugin requires `writer > 3.10.1`and depends on `writer.ConceptService` class. This class needs configuration from the writer config file.

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
        "propertyMap": {
            "uuid": "uuid",
            "ConceptName": "ConceptName",
            "ConceptStatus": "ConceptStatus",
            "ConceptDefinitionShort": "ConceptDefinitionShort",
            "ConceptDefinitionLong": "ConceptDefinitionLong",
            "ConceptImTypeFull": "ConceptImTypeFull",
            "ConceptImSubTypeFull": "ConceptImSubTypeFull",
            "ConceptGeometry": "ConceptGeometry",
            "ConceptBroaderRelation": "ConceptBroaderRelation",
            "ConceptReplacedByRelation": "ConceptReplacedByRelation"
        }
    }
```

### Output
Each selected or created concept will generate a link inside the articles `itemMeta` node.

```xml
    <link rel="subject" title="Evil corp." type="x-im/organisation" uuid="63d5dcc1-28f1-4892-9f44-142043541de1"/>
```

If the plugin config `appendDataToLink` is set to true concept data will be added as data to the link. The article data instructions are read from a remote config file that is unique per concept type.

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

### x-im/polygon
If the ConceptService config property `relatedGeoFunction` is set, a background check will be made to look up areas that corelates with selected polygon. The correlating areas will be added to the article as a `related-geo link` tag.

Available functions are: Contains, Intersects, IsWithin. These links are not displayed to the user but are to be concidered as an extension available for 

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