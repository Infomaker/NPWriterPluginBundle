# Marker plugin

Default plugin for marking, or highlighting, text.

## Plugin configuration

```json
{
    "id": "se.infomaker.marker",
    "name": "marker",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-marker.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-marker.css",
    "enabled": true,
    "mandatory": false,
    "data": {

    }
}
```


### Change default keyboard shortcut
This plugin supports configuration of the keyboard shortcut. If you want to specify
the keyboard shortcut you can do it like this.

```json
{
    "id": "se.infomaker.marker",
    "name": "marker",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-marker.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-marker.css",
    "enabled": true,
    "mandatory": false,
    "shortcut": {
        "default": "ctrl+alt+x",
        "mac": "cmd+alt+x"
    },
    "data": {

    }
}
```

### Options
Specifying options in the data section is optional. If no settings are are specified the
plugin will create a default html `mark` element and show the `fa-pain-brush` icon from
the Font Awesome project. You can change that behavior using the below settings.

**None of the options are required. But if you add a customized marker plugin with it's own tag name, all of the three `type`, `tagName`, `commandName` properties must be set.**

**icon**
Optionally set icon to be used in popover menu. Pick an icon name from the project Font Awesome.

**color**
Optionally specify the background color of the marked text.

**type**
The internal name of the marker annotation. This needs to be unique for every instance of a customised marker plugin. Optional but must be specified with `commandName` and `tagName`.

**commandName**
The name of the command, affects the tooltip as well. Needs to be unique within the writer. Optional but must be specified with `tagName` and `type`.

**tagName**
Output this tag in the html output instead of the default `mark`. Optional but must be specified with `commandName` and `type`.


### Examples
** Completely customised for marking specific text as print only **
```json
"data": {
    "icon": "fa-print",
    "color": "pink",
    "type": "printonly",
    "tagName": "printonly",
    "commandName": "print only"
}
```

** Using the marker plugin to support the html `sup` element
```json
"data": {
    "icon": "fa-paint-brush",
    "type": "sup",
    "tagName": "sup",
    "commandName": "super text"
}
```

## Output

Marked text is found inline in the content text element.

```xml
    <element id="paragraph-12cdd9b8d3fbf01a544e30b11751eef5" type="body">Body text with a <mark id="link-3d954f43b950f4b1704ba3e565e8467e">link to Google</mark>.</element>
```

Or optionally

```xml
    <element id="paragraph-12cdd9b8d3fbf01a544e30b11751eef5" type="body">Body text with a <span class="x-im-marked-text" id="link-3d954f43b950f4b1704ba3e565e8467e">link to Google</span>.</element>
```
