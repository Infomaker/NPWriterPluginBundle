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
  "mandatory": false
}
```

## Output
```xml
<object id="imagegallery-8a52dde8c22e270f0023d2060b0128b4" type="x-im/imagegallery" >
    <data>
        <text>In sodales lectus vel egestas rhoncus</text>
    </data>
    <links>
        <link rel="image" type="x-im/image" uri="im://image/znX8U1CU124n26zu7gb40_jBzSk.jpeg" uuid="c382c937-8511-5d48-9677-55658c2bbb32">
            <data>
                <text>Image caption</text>
                <height>200</height>
                <width>400</width>
                <links>
                    <link rel="author" uuid="7a39b42b-1315-4711-a136-7b3a9f132110" title="Demo Demosson" type="x-im/author">
                        <data>
                            <email>demo.demosson@infomaker.se</email>
                        </data>
                    </link>
                </links>
            </data>
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
