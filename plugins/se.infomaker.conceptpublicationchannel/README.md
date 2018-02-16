# Concept Publication Channel plugin

This plugin uses a `Editorial Ba-proxy` to search Editorial OC backend for concepts. `ConceptService` configuration needed in `writer-config.json`

## Dependency

- This plugin requires `writer > 3.14.0` and depends on the `writer.ConceptService.getRemoteConceptsByType(conceptType)` method to exist.
- This plugin requires a contentHost (editorial ba-proxy) which is used for Open Content search requests towards the editorial Open Content, 

## Plugin config

```json
{
    "id": "se.infomaker.conceptpublicationchannel",
    "name": "conceptpublicationchannel",
    "url": "http://localhost:5001/im-conceptpublicationchannel.js",
    "style": "http://localhost:5001/im-conceptpublicationchannel.css",
    "mandatory": false,
    "enabled": true,
    "data": {
        "conceptType": "x-im/channel"
    }
}
```

### Writer config

Configuration for the writer config file. This plugin uses the same ConceptService-class as the ximconcepts-plugin, therefor this configuration only needs to be entered once.

```json
"conceptServiceConfig": {
    "conceptPath": "https://s3-eu-west-1.amazonaws.com/concepts-config-dev/writer/",
    "baProxy": {
        "protocol": "http://",
        "hostName": "ba-editorial.env.XXX.com",
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
        ... (see documentation below)
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
    "ConceptBroaderRelation": "ConceptBroaderRelation",
    "ConceptReplacedByRelation": "ConceptReplacedByRelation",
    "ConceptAvatarUuid": "ConceptAvatarUuid"
}
```