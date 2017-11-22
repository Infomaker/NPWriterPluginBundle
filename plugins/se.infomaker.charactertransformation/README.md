# Character transformation plugin
This plugin can be configured to replace certain characters for others. For example to apply the correct typographical quotation marks instead of staight quotation marks that is the default on many systems.

## Plugin configuration
```json
{
  "id": "se.infomaker.charactertransformation",
  "name": "charactertransformation",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/index.js",
  "enabled": true,
  "mandatory": false,
  "data": {
      "rules": [
        {
            "char": "\"",
            "to": ["“", "”"]
        },
        {
            "char": "'",
            "to": "’"
        },
        {
            "char": "-",
            "position": 0,
            "to": "– "
        }
    ]
  }
}
```
## Rules
Rules describe what characters should be replaced with what characters.

The first example above will replace a straight double quote into either a left typographical quote or a right typographical quote depending on whether it is a closing or opening quote.

The second example will replace a straight single quote into a right single quote.

The third example will replace a minus with a longer dash if the minus is the first character in a paragraph.
