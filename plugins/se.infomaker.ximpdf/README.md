# PDF plugin
Enables for user to either drag and drop a PDF file from disk or from URL or use the the "pen" in the context menu. The
PDF will be uploaded in a configured (in the backend) S3 bucket and a NewsItem will be created for the PDF.

## Configuration
```
{"data": {"disableUseOfAnnotationTools": true}} 
``` 
Disable/Enable annotation tool (e.g. bold) for the plugin.

## Output
When uploading a PDF file, the plugin will create, using the Writer backend endpoints, a NewsItem that will be stored
in the repository for the Writer. The NewsItem will have mimetype `application/vnd.iptc.g2.newsitem+xml.graphic` and 
the following format:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<newsItem conformance="power" guid="146e1985-1601-5cce-a788-02e286da5905" standard="NewsML-G2"
    standardversion="2.20" version="1" xmlns="http://iptc.org/std/nar/2006-10-01/">
    <catalogRef href="http://www.iptc.org/std/catalog/catalog.IPTC-G2-Standards_27.xml"/>
    <catalogRef href="http://infomaker.se/spec/catalog/catalog.infomaker.g2.1_0.xml"/>
    <itemMeta>
        <itemClass qcode="ninat:graphic"/>
        <versionCreated>2017-10-10T12:33:30Z</versionCreated>
        <firstCreated>2017-10-10T12:33:30Z</firstCreated>        
        <pubStatus qcode="imext:draft"/>
        <itemMetaExtProperty type="imext:type" value="x-im/pdf"/>
        <fileName>JJNkhhdnDXsU7ogWnOwLKF4uq9Y.pdf</fileName>
        <links xmlns="http://www.infomaker.se/newsml/1.0"/>
        <itemMetaExtProperty type="imext:uri" value="im://pdf/JJNkhhdnDXsU7ogWnOwLKF4uq9Y.pdf"/>
        <itemMetaExtProperty type="imext:originalUrl" value="https://writer-dev-public-pdfs.s3.amazonaws.com/JJNkhhdnDXsU7ogWnOwLKF4uq9Y.pdf"/>
    </itemMeta>
    <contentMeta>
        <contentCreated>2017-10-10T12:33:30Z</contentCreated>
        <contentModified>2017-10-10T12:33:30Z</contentModified>
        <metadata xmlns="http://www.infomaker.se/newsml/1.0">
            <object id="IwyKMvH0DLrX" type="x-im/pdf">
                <data>
                    <objectName>Test.pdf</objectName>
                </data>
            </object>
        </metadata>
    </contentMeta>
</newsItem>
``` 

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