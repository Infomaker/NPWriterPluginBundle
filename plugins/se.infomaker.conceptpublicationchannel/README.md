# Concept Publication Channel plugin

This plugin uses a `Editorial Ba-proxy` to search Editorial OC backend for concepts of type `x-im/channel`. `ConceptService` configuration needed in `writer-config.json`

## Dependency

- This plugin requires `writer > 4.5.0`.
- This plugin requires a contentHost (editorial ba-proxy) which is used for Open Content search requests towards the editorial Open Content,

## Plugin config

- `"disableMainChannel": true` An optional property to disable usage of "mainchannel" and only render normal channel pills

```json
{
    "id": "se.infomaker.conceptpublicationchannel",
    "name": "conceptpublicationchannel",
    "url": "http://localhost:5001/im-conceptpublicationchannel.js",
    "style": "http://localhost:5001/im-conceptpublicationchannel.css",
    "mandatory": false,
    "enabled": true,
    "data": {
        "disableMainChannel": true
    }
}
```

### Writer config

Configuration for the writer config file. This plugin uses the same ConceptService-class and config as the ximconcepts-plugin, therefor this configuration only needs to be entered once.

See readme in XimConceptPlugin for more information.

#### Property map

The property map is used to translate different kind of OC configurations into prop-names ConceptService can use. ConceptPublicationChannelPlugin requires some additional properties. See full list below.
The left hand side will be used by ConceptService, fill in the property-names from OC on the right hand side.

```json
"propertyMap": {
    "uuid": "uuid",
    "ConceptName": "ConceptName",
    "ConceptNameString": "ConceptNameString",
    "ConceptStatus": "ConceptStatus",
    "ConceptDefinitionShort": "ConceptDefinitionShort",
    "ConceptDefinitionLong": "ConceptDefinitionLong",
    "ConceptImTypeFull": "ConceptImTypeFull",
    "ConceptImSubTypeFull": "ConceptImSubTypeFull",
    "ConceptGeometry": "ConceptGeometry",
    "ConceptAvatarUuid": "ConceptAvatarUuid",
    "ConceptAssociatedWith": "ConceptAssociatedWith",
    "ConceptBroaderRelation": "ConceptBroaderRelation",
    "ConceptAssociatedWithRelations": "ConceptAssociatedWithRelations",
    "ConceptAssociatedWithMeRelations": "ConceptAssociatedWithMeRelations",
    "ConceptReplacedByRelation": "ConceptReplacedByRelation"
}
```