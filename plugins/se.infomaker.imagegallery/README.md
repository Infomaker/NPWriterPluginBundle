# Image gallery plugin

Documentation for the Image gallery plugin

## Plugin configuration

```json
    {
        
    }
```

### Configuration options

## Format

```xml
    <object id="imagegallery-8a52dde8c22e270f0023d2060b0128b4" type="x-im/imagegallery" >
        <data>
            <!-- 
                caption on gallery level is an "optional" element used as an "generic caption" for all
                of the images in the gallery
            -->
            <caption>In sodales lectus vel egestas rhoncus</caption>
        </data>
        <links>
            <link rel="image" type="x-im/image"
                uri="im://image/znX8U1CU124n26zu7gb40_jBzSk.jpeg"
                uuid="c382c937-8511-5d48-9677-55658c2bbb32">
                <data>
                    <caption>Image caption</caption>
                    <credit>Photagraphers name</credit>
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

