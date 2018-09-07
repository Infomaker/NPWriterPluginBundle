# Infomaker IM.ID user byline plugin

A plugin that handles IM.ID user byline implementation for traceability. Will by default set current user as author on new articles.

It will also set IM.ID sub on connected author concepts.

![IM.ID user byline workflow](./docimages/writer-imid-byline.png "IM.ID user byline workflow")

## Dependencies

requires `writer => IM.ID`
requires `ConceptPlugin (x-im/author) > IM.ID`

## Configuration

The following config is used in the plugin config:

- `"useAuthorConcept": true` Boolean to indicate if AuthorConcept should be set or not, when user creates a new article, default value if omitted is set to true

```json
{
    "id": "se.infomaker.user-byline",
    "name": "im-user-byline",
    "url": "http://localhost:5001/im-user-byline.js",
    "style": "http://localhost:5001/im-user-byline.css",
    "mandatory": false,
    "enabled": true,
    "data": {
        "useAuthorConcept": false
    }
}
```

## Open Content

Editorial Open content needs to be updated with a few new Indexfields and Properties. Those are described and specified in `editorial/writer/writer-user-configuration.yml` in [Open Content Configs repository](https://bitbucket.org/infomaker/opencontent-configs/src/master/)

## Writer config

The following properties needs to be added to the `ConceptService` part of the writer config:

```json
"propertyMap": {
    ...
    "ConceptAuthorFirstname": "ConceptAuthorFirstname",
    "ConceptAuthorLastname": "ConceptAuthorLastname",
    "ConceptAuthorEmail": "ConceptAuthorEmail",
    "ConceptImIdSubjectId": "ConceptImIdSubjectId",
    ...
}
```
