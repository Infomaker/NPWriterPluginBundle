# Marker plugin

Default plugin for marking, or highlighting, text. Using this plugin you can add html annotations like `mark`, `code`, `cite` or completely custom tags. This plugin can be used multiple times in one installation with different configuration.

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

### Configuring multiple plugins

Special care is needed when adding a plugin multiple times. The properties `id`, `url` and `style` needs to be unique. Therefore you can add suffix like the below example (code).

```json
{
    "id": "se.infomaker.marker.code",
    "name": "marker",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-marker.js?v=code",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-marker.css?v=code",
    "enabled": true,
    "mandatory": false
}
```

### Add a keyboard shortcut
This plugin supports configuration of the keyboard shortcut. If you want to specify
a keyboard shortcut you can do it like this.

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

*None of the options are required. But if you add a customized marker plugin with it's own tag name, all of the three `type`, `tagName`, `commandName` properties must be set.*

**icon**

Optionally set icon to be used in popover menu. Pick an icon name from the project Font Awesome.

**style**

Optionally specify the css to apply to the marked text.

**type**

The internal name of the marker annotation. This needs to be unique for every instance of a customised marker plugin. Optional but must be specified with `commandName` and `tagName`.

**commandName**

The name of the command, affects the tooltip as well. Needs to be unique within the writer. Optional but must be specified with `tagName` and `type`.

**tagName**

Output this tag in the html output instead of the default `mark`. Optional but must be specified with `commandName` and `type`.


### Examples
** Completely customised for marking specific text as print only using a custom, non html, tag name **
```json
"data": {
    "icon": "fa-print",
    "style": {
        "background-color": "pink"
    },
    "type": "printonly",
    "tagName": "printonly",
    "commandName": "print only"
}
```

** Using the marker plugin to support the inline html `code` element with some custom styling.
```json
"data": {
    "type": "code",
    "tagName": "code",
    "commandName": "code fragment",
    "icon": "fa-code",
    "style": {
        "background-color": "#eeeeee",
        "letter-spacing": "2px"
    }
}
```

## Output

Marked text is found inline in the content text element as in the following examples *(with line breaks added for readability).*

**Default behaviour**
```xml
    <element id="paragraph-12cdd9b8d3fbf01a544e30b11751eef5" type="body">
        Body text with a
        <mark id="link-3d954f43b950f4b1704ba3e565e8467e">link to Google</mark>
    </element>
```

**Custom tag**
```xml
    <element id="paragraph-12cdd9b8d3fbf01a544e30b11751eef5" type="body">
        Body text with a
        <printonly id="link-3d954f43b950f4b1704ba3e565e8467e">link to Google</printonly>
    </element>
```
