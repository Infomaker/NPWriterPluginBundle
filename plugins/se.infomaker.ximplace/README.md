# Geoposition plugin
This plugin handles searching and selecting "geopositions" for an article. These are `Concepts` which
are documented here: https://github.com/Infomaker/writer-format/tree/master/newsml/conceptitem.

## Plugin configuration
This plugin can be configured to support either "Positions" or "Polygons". It is possible to configure two
parallel instances of the plugin, one configured to handle positions and one handling polygons. If the plugin
is configured to handle positions, the user is allowed to add new and edit existing position geopositions. Polygon
geopositions are read only.

The types of `Concepts` that are handled by the plugin is dictated by configuration of the
customers configuration file in [Concept Backend](https://bitbucket.org/infomaker/concepts-backend).

### Position configuration
Use the following configuration to enable position geopositions;

```json
{
    "id": "se.infomaker.ximplace",
    "name": "ximplace",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximplace.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximplace.css",
    "enabled": true,
    "mandatory": true,
    "data": {"googleMapAPIKey": "AIzaSyAdlr4ZwU9U8kD9ophla29QaHboNIiyj5c"}
}
```
The URLs for `url` and `style` depends on which version of the plugin you want to use. The `googleMapAPIKey` is
needed to be able to use the map feature in the plugin. This key is customer specific/owned.

### Polygon configuration
Use the following configuration to enable polygon geopositions;

```json
{
    "id": "se.infomaker.ximplace-polygon",
    "name": "ximplace",
    "url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximplace-polygon.js",
    "style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximplace-polygon.js",
    "enabled": false,
    "mandatory": false,
    "data": {
        "features": "polygon",
        "polygon": {"editable": false},
        "googleMapAPIKey": "AIzaSyAdlr4ZwU9U8kD9ophla29QaHboNIiyj5c"
    }
}
```
he URLs for `url` and `style` depends on which version of the plugin you want to use. The `googleMapAPIKey` is
needed to be able to use the map feature in the plugin. This key is customer specific/owned.

## Output
In the article, the plugin will add the xml block under `newsItem > itemMeta > links`. The elements added
will depend if plugin configured for positions or polygons (the difference is really value of `geometry` element).

### Position output
```xml
<link title="Kalmar Airport" uuid="d517c790-e5f9-4b1c-80d8-d4fa88ac0888" rel="subject" type="x-im/place">
    <data>
        <geometry>POINT(16.288760899999943 56.68542669999999)</geometry>
    </data>
</link>
```

### Polygon output
```xml
<link title="Kalmar" uuid="320938f8-db94-11e5-b5d2-0a1d41d68578" rel="subject" type="x-im/place">
    <data>
        <geometry>POLYGON((15.927104999999983 56.52092099999997,15.81290899999999
            56.521005,15.761852999999974 56.53631000000001,15.743408000000045
            56.56162099999999,15.763378999999986 56.578452000000006,15.76974999999993
            56.60278499999998,15.884826999999973 56.610537,15.937459999999987
            56.65602899999998,15.897770000000037 56.683924000000005,15.953058000000055
            56.69666199999999,16.06211499999995 56.671465000000005,16.07262000000003
            56.71785899999999,16.03175699999997 56.74044700000002,16.12640399999998
            56.75234799999998,16.11106300000006 56.80044500000001,16.11191800000006
            56.84746899999999,16.150035000000003 56.841344,16.178530000000023
            56.87930699999998,16.174943999999982 56.90671000000002,16.23679500000003
            56.93642099999999,16.370225000000005 56.895477,16.438777000000073
            56.887794,16.444588920898468 56.827982181232876,16.45837226464846
            56.8129675976375,16.506553275390615 56.78757339890983,16.461156719726546
            56.75290442123698,16.399744000000055 56.78296599999998,16.38394282031254
            56.65206280372057,16.31990650292971 56.62710503013163,16.28092002148435
            56.60460106881793,16.224918000000002 56.595492,16.22716300000002
            56.54824099999998,16.21953540234381 56.5145372338241,16.17962291015624
            56.48224874176693,16.12245400000006 56.470696000000004,16.002729000000045
            56.50876299999999,15.99745299999995 56.52902499999998,15.927104999999983
            56.52092099999997))</geometry>
    </data>
</link>
```

## Backend
The plugin communicates with Concept Backend in order to search for geoposition `Concepts`. Configuration for this
communication is configured in Writers server config file under property `conceptbackend`. When searching, the plugin 
will make a "search" request of type/entity `position_locations` or `polygon_locations` (depending on what the plugin
is configured for) towards the Concept Backend. Details regarding this request  is specified in 
[Concept Backend](https://bitbucket.org/infomaker/concepts-backend).