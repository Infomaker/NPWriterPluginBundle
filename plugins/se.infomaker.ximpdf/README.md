# PDF plugin
Enables for user to either drag and drop a PDF file from disk or from URL or use the the "pen" in the context menu. The
PDF will be uploaded in a configured (in the backend) S3 bucket and a NewsItem will be created for the PDF.

## Plugin configuration


```json
{
"id": "se.infomaker.ximpdf",
"name": "ximpdf",
"url": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximpdf.js",
"style": "https://plugins.writer.infomaker.io/releases/{PLUGIN_VERSION}/im-ximpdf.css",
"enabled": true,
"mandatory": false,
"data": {
  "disableUseOfAnnotationTools": true
  }
}
``` 

Disable/Enable annotation tool (e.g. bold) for the plugin.

## Output
When uploading a PDF file, the plugin will create, using the Writer backend endpoints, a NewsItem that will be stored
in the repository for the Writer. The NewsItem will have mimetype `application/vnd.iptc.g2.newsitem+xml.graphic`. 
The format is described at [GitHub](https://github.com/Infomaker/writer-format/blob/master/newsml/newsitem/newsitem-pdf.xml): 

In the article, the plugin will add the following xml block under `newsItem > contentSet > inlineXML > idf > group`:
```xml
<object id="MjE5LDE5NCwxOTUsMTQ1" type="x-im/pdf" uuid="146e1985-1601-5cce-a788-02e286da5905">
    <links>
        <link rel="self" type="x-im/pdf" uri="im://pdf/JJNkhhdnDXsU7ogWnOwLKF4uq9Y.pdf" uuid="146e1985-1601-5cce-a788-02e286da5905">
            <data>
                <text>Test.pdf</text>
            </data>
        </link>
    </links>
</object>
```