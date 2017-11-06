# Publication flow plugin
This plugin is the default plugin for handling the article workflow, including saving, setting article statuses and scheduling articles for publication.

## Plugin configuration
A workflow consists of a number of workflow items. These are defined in the plugins configuration.

```json
{
    "id": "se.infomaker.publishflow2",
    "name": "publishflow2",
    "url": "https://plugins.writer.infomaker.io/dev/im-publishflow2.js",
    "style": "https://plugins.writer.infomaker.io/dev/im-publishflow2.css",
    "enabled": true,
    "mandatory": true,
    "data": {
        "workflow": {
            "imext:draft": {
                ...
            },
            "imext:done": {
                ...
            },
            "stat:usable": {
                ...
            }
        }
    }
```

### Workflow item
 Each workflow item, or status, is a combination of an action, a status, allowed actions for the this status as well as possible publication start and end time manipulations.

Below is a workflow item for the `stat:usable` status; its title and description, its values for the actual action button created

The properties `actionLabel` and `icon` support both a string and an array with two strings. If two values are suppled the first is used when the current status is different than this status; the second is used when the current status is the same as this status. I.e to provide different action labels for publish or republish as in the example.

```json
"stat:usable": {
    "statusTitle": "Published",
    "statusDescription": "The article has been published",
    "actionName": "Republish article?",
    "actionLabel": [
        "Publish article",
        "Republish article"
    ],
    "icon": [
        "fa-send",
        "fa-retweet"
    ],
    "color": "#288dc0",
    "allowed": [
        "stat:usable",
        "stat:canceled"
    ],
    "actions": {
        "pubStart": "set"
    }
}
```

### Actions

### Output
The plugin updates the article depending on selections made in the plugin. The status selected updates the
`qcode` attribute of `newsItem > itemMeta > pubStatus` element. Changes to publications start and end dates
update corresponding dates in `newsItem > itemMeta`, e.g.

```xml
<itemMetaExtProperty value="2017-10-12T00:00:00+02:00" type="imext:pubstart"/>
<itemMetaExtProperty value="2017-10-11T00:00:00+02:00" type="imext:pubstop"/>
```

