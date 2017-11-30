# Image Gallery Plugin
Image Gallery with image preview and toolbox with drag-and-drop support
for sorting images.

## Plugin configuration
```json
{
  "id": "se.infomaker.imagegallery",
  "name": "imagegallery",
  "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-imagegallery.js",
  "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-imagegallery.css",
  "enabled": true,
  "mandatory": false,
  "data": {
    "cropsEnabled": true,
    "crops": {
      "16:9": [16, 9],
      "8:5": [8, 5],
      "4:3": [4, 3],
      "1:1": [1, 1]
    }
  }
}
```

### Options
| Property          | Type      | Required  | Description   |
| --------          | :--:      | :------:  | -----------   |
| **cropsEnabled**  | Boolean   | `false`   | The soft crop dialog is hidden by default. Set `cropsEnabled` to `true` to enable. Default `false`. |
| **crops**         | Object    | `false`   | *Required if crops is enabled.<br>Expressed as an object of named ratios. The value for each named dimension is an array of the width and height ratio. |

## Output
```xml
<object id="imagegallery-8a52dde8c22e270f0023d2060b0128b4" type="x-im/imagegallery">
    <data>
        <text>In sodales lectus vel egestas rhoncus</text>
    </data>
    <links>
        <link rel="image" type="x-im/image" uri="im://image/znX8U1CU124n26zu7gb40_jBzSk.jpeg" uuid="c382c937-8511-5d48-9677-55658c2bbb32">
            <data>
                <text>Image caption</text>
                <height>200</height>
                <width>400</width>
            </data>
            <links>
                <link rel="crop" type="x-im/crop" title="16:9" uri="im://crop/0/0/0.445/0.3707865168539326"/>
                <link rel="crop" type="x-im/crop" title="8:5" uri="im://crop/0.4025/0/0.5975/0.5599250936329588"/>
                <link rel="crop" type="x-im/crop" title="4:3" uri="im://crop/0.055/0/0.89/1"/>
                <link rel="crop" type="x-im/crop" title="1:1" uri="im://crop/0.16625/0/0.6675/1"/>
                <link rel="author" uuid="7a39b42b-1315-4711-a136-7b3a9f132110" title="Demo Demosson" type="x-im/author">
                    <data>
                        <email>demo.demosson@infomaker.se</email>
                    </data>
                </link>
            </links>
        </link>

        <!-- Fallback when x-im/imagegallery is unknown-->
        <link rel="alternate" type="image/jpg" url="https://imengine.se/457383845734734">
            <data>
                <width>400</width>
                <height>200</height>
            </data>
        </link>
    </links>
</object>
```

**Note** that `object > data > text` is optional and will only render if it has a value.
