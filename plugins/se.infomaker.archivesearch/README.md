# Archive search plugin for Infomaker Writer
The archive search plugin is a great way of searching for images in archive repositories.

## Plugin configuration

```json
{
  "id": "se.infomaker.archivesearch",
  "name": "im-archivesearch",
  "url": "http://localhost:5001/im-archivesearch.js",
  "style": "http://localhost:5001/im-archivesearch.css",
  "mandatory": false,
  "enabled": true,
  "data": {
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
          "latest": "true"
        },
        "resultsMapping": {
          "Filename": "name",
          "thumbnail": "thumbnail",
          "primary": "url",
          "Photographer": "credit",
          "Description": "caption",
          "ImageSource": "source"
        }
      }
    ]
  }
}
```

### Options

| Property          | Type      | Required  | Description   |
| --------          | :--:      | :------:  | -----------   |
| **archiveHosts**  | Array     | `true`    | Array containing query, and host configuration for OpenContent hosts. |

### Archive Hosts Options
Archive Host Configuration Example:

```javascript
{
    "name": "Internal OC-Archive",
    "host": { ... },
    "standardQuery": { ... },
    "resultsMapping": { ... }
}
```


| Property            | Type      | Required  | Description   |
| --------            | :--:      | :------:  | -----------   |
| **name**            | String    | `true`    | Name for OC Host, displayed in drop down list of available OC Hosts. Short but descriptive. |
| **host**            | Object    | `true`    | Descriptive label for Type, displayed in tab menu. |
| **standardQuery**   | Object    | `true`    | Object containing properties used for every search-call to chosen OC Host. |
| **resultsMapping**  | Object    | `true`    | Object used for mapping OC Properties to properties used by the plugin. See [Results Mapping Options](#results-mapping-options) |

### Host Options
Host configuration used by BA-proxy service.

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
"key: value"-Object used for mapping OpenContent properties to properties used by the archive search plugin. To customize the mapped values, change the string-value of the "key".
The "value"-strings used by the plugin are defined below.

```json
{
    "thumbnail": "thumbnail",
    "primary": "url",
    "Photographer": "credit",
    "Description": "caption",
    "ImageSource": "source"
}
```

| Value         | Plugin Use    |
| --------      | -----------   |
| **thumbnail** | Used for presenting the thumbnail of image. |
| **url**       | Url to original image binary. Used by plugin to upload archive image to current OC configuration. |
| **credit**    | String crediting the image. Sets the `credit`-value of the created Image. |
| **caption**   | String used to set the `caption`-value of created Image. |
| **source**    | String used by plugin to display the source of the image, alongside the credit-value |

## Output
Generates no direct output.
