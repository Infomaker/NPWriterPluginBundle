# Publication flow plugin
This plugin is the default plugin for handling the article workflow, including saving, setting article statuses and scheduling articles for publication.

* This plugin has dependencies to EditorService which defines which values are available for _pubStatus_.

* The itemMetaExtproperty _haspublishedversion_ flag is only applicable when using an editorial OpenContent together with a public repository. This will then enable you to keep a published version in the public repository and another version, for example draft, in the editorial OpenContent so that a reporter can continue working on a published article without publishing changes immediately.

## Plugin configuration
A workflow consists of a number of workflow items (states). These are defined in the plugins configuration.

```json
{
    "id": "se.infomaker.publishflow2",
    "name": "publishflow2",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-publishflow2.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-publishflow2.css",
    "enabled": true,
    "mandatory": true,
    "data": {
        "workflow": {
            "draft": {
                ...
            },
            "done": {
                ...
            },
            "publish": {
                ...
            }
        }
    }
```

## Workflow item
Each workflow item defines properties for that state, actions to perform when entering the state and all allowed transitions to other states.

### Example
Below is a workflow item named "publish" for the `stat:usable` pubStatus. The name is used to reference this workflow item, _state_, from other transitions.

```json
"publish": {
    "pubStatus": "stat:usable",
    "title": "Artikeln är publicerad",
    "description": "Du jobbar direkt mot den publicerade artikeln",
    "saveActionLabel": "Uppdatera",
    "icon": "fa-upload",
    "color": "#288dc0",
    "transitions": [{
            "nextState": "republish",
            "title": "Ompublicera"
        },
        {
            "nextState": "draft",
            "priority": "secondary",
            "title": "Fortsätt arbeta med utkast"
        },
        {
            "nextState": "cancel",
            "title": "Avpublicera"
        }
    ],
    "actions": [{
        "pubStart": "set",
        "pubStop": "clear",
        "pubStatus": "stat:usable",
        "hasPublishedVersion": true
    }]
}
```

### Top level properties
These are the top level properties for a workflow item.

_The properties pubStatus, title, description, saveActionLabel can be left out when you want to have a workflow item that handles specific actions without keeping its own state. An example is "republish" that should appear in the menu and resets the pubStart value but then leaves the state to be handled by the "publish" workflow item._

| Property | Description |
|----------|-------------|
|pubStatus|The pubStatus value for this item. |
|title|Main title displayed to the user directly in the writer top bar
|description|Longer description displayed in the publish flow popout dialog|
|saveActionLabel|Specify the label for the default save button in the Writer|
|icon|Icon displayed in menu for the menu option to move to this state, uses Font Awesome icon classes|
|color|Icon background color, normally Infomaker standard colors|
|transitions|An array of available transitions to other states|
|actions|Actions to perform when entering this state|
|||

### Transitions
An array of available transitions to other states.

```json
"transitions": [{
        "nextState": "publish",
        "title": "Publicera",
        "preCondition": {
            "hasPublishedVersion": false
        }
    },
    ...
]
```

| Property | Description |
|----------|-------------|
|nextState|The name of a workflow item to transition to|
|title|The title of the menu option displayed to the user (icon from next state is used automatically)|
|priority|Optional, can be either "primary" or "secondary", will display this as a more visible call to action button above all other transition menu items|
|preCondition|A condition for this transition. Only `hasPublishedVersion` true/false supported right now. For example ```preCondition{ "hasPublishedVersion": true }``` will make this transition visible only if the article has a published (public) version. |

### Actions
An object of actions to perform when first transitioning into this workflow item. Surrounded by an array.

All action properties are optional.
```json
"actions": [{
    "pubStart": "set",
    "pubStop": "clear",
    "pubStatus": "stat:usable",
    "hasPublishedVersion": true
}]

```
| Property | Description |
|----------|-------------|
|pubStart|`required`, `set` or `clear`. Required requires the users to choose a valid time before this transition can be made. Set and clear sets or clears the pubStart.|
|pubStop|`required`, `set` or `clear`. Required requires the users to choose a valid time before this transition can be made. Set and clear sets or clears the pubStop.|
|pubStatus|The most commonly used. A string that defines the pubStatus value to set in the NewsML when first transitioning into this state.|
|hasPublishedVersion|Set NewsML flag to either `true` or `false`|



### Output
The plugin updates the article depending on selections made in the plugin. The status selected updates the
`qcode` attribute of `newsItem > itemMeta > pubStatus` element. Changes to publications start and end dates
update corresponding dates in `newsItem > itemMeta`, e.g.

```xml
<newsItem ...>
    ...
    <itemMeta>
        <pubStatus qcode="stat:usable"/>
        <itemMetaExtProperty value="2017-10-12T00:00:00+02:00" type="imext:pubstart"/>
        <itemMetaExtProperty value="2017-10-11T00:00:00+02:00" type="imext:pubstop"/>
        <itemMetaExtProperty type="imext:haspublishedversion" value="true"/>
        ...
    </itemMeta>
    ...
</newsItem>
```
