# Archive Search Plugin
The archive search plugin is a great way of searching for images in archive repositories.

## Plugin Configuration

```json
{
  "id": "se.infomaker.archivesearch",
  "name": "im-archivesearch",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-archivesearch.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-archivesearch.css",
  "mandatory": false,
  "enabled": true,
  "data": {
    "defaultSorting": "Updated",
    "archiveHosts": [
      {
        "name": "Internal OC-Archive",
        "host": {
          "protocol": "http://",
          "hostName": "localhost",
          "port": "5555",
          "healthPath": "/health",
          "queryPath": "/search",
          "objectPath": "/objects",
          "sortingsPath": "/sortings"
        },
        "standardQuery": {
          "contenttype": "Image",
          "mimetype": "image/jpeg OR image/gif OR image/png",
          "latest": "true"
        },
        "resultsMapping": {
          "name": "Filename",
          "thumbnail": "thumbnail",
          "url": "primary",
          "credit": "Photographer",
          "caption": "Description",
          "description": "Description",
          "source": "ImageSource",
          "photoDate": "Photodate"
        },
        "type": "editorial-opencontent"
      }
    ]
  }
}
```

### Options

| Property          | Type      | Required  | Description   |
| --------          | :--:      | :------:  | -----------   |
| **defaultSorting** | String   | `false`   | Name of the OC sorting to be used as default sorting |
| **archiveHosts**  | Array     | `true`    | Array containing query, and host configuration for OpenContent hosts. |

### Archive Hosts Options
Archive Host Configuration Example:

```javascript
{
    "name": "Internal OC-Archive",
    "host": { ... },
    "standardQuery": { ... },
    "resultsMapping": { ... }
    "type": "..."
}
```

| Property            | Type      | Required  | Description   |
| --------            | :--:      | :------:  | -----------   |
| **name**            | String    | `true`    | Name for OC Host, displayed in drop down list of available OC Hosts. Short but descriptive. |
| **host**            | Object    | `true`    | Descriptive label for Type, displayed in tab menu. |
| **standardQuery**   | Object    | `true`    | Object containing properties used for every search-call to chosen OC Host. |
| **resultsMapping**  | Object    | `true`    | Object used for mapping OC Properties to properties used by the plugin. See [Results Mapping Options](#results-mapping-options) |
| **type**            | String    | `false`   | Set to `editorial-opencontent` when searching for images in the Writer editorial repository |

Note: When type is editorial-opencontent, the images need to have thumbnail representations in Open Content
in order for them to be visible in the search result. This is a configuration option in Editor Service.

### Host Options
Host configuration used by the BA-proxy service.

```json
{
    "protocol": "http://",
    "hostName": "localhost",
    "port": "5555",
    "healthPath": "/health",
    "queryPath": "/search",
    "objectPath": "/objects",
    "sortingsPath": "/sortings"
}
```

#### IMID protected ba-proxy, host configuration

If a IMID protected proxy is used the `"credentials": "include"` property *MUST* be set, if there is no IMID it *MUST NOT* be set, or set to `omit`

```json
{
    "credentials": "include",
    "protocol": "http://",
    "hostName": "localhost",
    "port": "5555",
    "healthPath": "/health",
    "queryPath": "/search",
    "objectPath": "/objects",
    "sortingsPath": "/sortings"
}
```

### Standard Query Options
Standard options used for every search call. Might be used for contenttype filtering, disabling faceting, or enabling only fetching latest version of a document.   
See Open Content API documentation for available properties.

```json
{
    "contenttype": "Image",
    "latest": "true"
}
```

### Results Mapping Options
"key: value"-object used for mapping properties used by the plugin to OpenContent properties. To customize the mapped values, change the string-value of the "value".
The "key"-strings used by the plugin are defined below. It is possible to map multiple keys to the same OC-property.

```json
{
  "name": "Filename",
  "thumbnail": "thumbnail",
  "url": "primary",
  "credit": "Photographer",
  "caption": "Caption",
  "description": "Description",
  "source": "ImageSource",
  "photoDate": "Photodate"
}
```

**Change Mapped OC-property**   
Example: To change the mapped value of `description` from OC-property `Description` to `Text`:

```json
{
  "description": "Text"
}
```
The value of the `description`-property will now get its value from the OC-property `Text`.

**One OC-property mapped to many keys**   
In this example, both properties `caption` and `description` will get its value from the OC-property `Caption`.

```json
{
  "caption": "Caption",
  "description": "Caption"
}
```

#### Available keys and their use

| Key             | Plugin Use    |
| --------        | -----------   |
| **name**        | Displayed when viewing the big picture preview. |
| **thumbnail**   | Used for presenting the thumbnail of image. |
| **url**         | Url to original image binary. Used by plugin to upload archive image to current OC configuration, and to display big picture preview. |
| **credit**      | String crediting the image. Sets the `credit`-value of the created Image. |
| **caption**     | String used to set the `caption`-value of created Image. |
| **description** | Displayed when viewing the big picture preview. |
| **source**      | String used by plugin to display the source of the image, alongside the credit-value. |
| **photoDate**   | Displayed when showing the big picture. Will be formatted to `YYYY-MM-DD` when rendered. |

## Output
Generates no direct output. Images in Archive Search Plugin are draggable and compatible with the Writer surface 
and plugins which support images.
