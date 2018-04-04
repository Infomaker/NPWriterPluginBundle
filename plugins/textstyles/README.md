# Textstyle plugins

Each text style in writer has a corresponding plugin which is responsible for
visualizing the text style in writer, and convert to/from the NewsML document format.

The text styles that are provided in this package are:

| Name | ID |
|---|---|
|blockquote|se.infomaker.blockquote|
|dateline|se.infomaker.dateline|
|drophead|se.infomaker.drophead|
|factbody|se.infomaker.factbody|
|headline|se.infomaker.headline|
|madmansrow|se.infomaker.madmansrow|
|pagedateline|se.infomaker.pagedateline|
|paragraph|se.infomaker.paragraph|
|preamble|se.infomaker.preamble|
|preleadin|se.infomaker.preleadin|
|subheadline|se.infomaker.subheadline|


## Plugin configuration

```json
{
    "id": "se.infomaker.{{textstyle}}",
    "name": "{{textstyle}}",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-textstyle-{{textstyle}}.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-textstyle-{{textstyle}}.css",
    "enabled": true,
    "mandatory": false
}
```


### Change default keyboard shortcut
This plugin supports configuration of the keyboard shortcut. If you want to specify
the keyboard shortcut you can do it like this.

```json
{
    "id": "se.infomaker.{{textstyle}}",
    "name": "{{textstyle}}",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-textstyle-{{textstyle}}.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-textstyle-{{textstyle}}.css",
    "enabled": true,
    "mandatory": false,
    "shortcut": {
        "default": "ctrl+alt+7",
        "mac": "cmd+alt+7"
    }
}
```

